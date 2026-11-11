import { SalesInvoiceItem, AdditionalCharges } from '../types';

export interface CalculationResult {
  items: SalesInvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  taxableAmount: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  totalTax: number;
  additionalChargesTotal: number;
  roundOff: number;
  grandTotal: number;
  balanceDue: number;
  amountInWords: string;
}

export interface ValidationIssue {
  field: string;
  message: string;
}

/**
 * Rounds a number to 2 decimal places using standard financial rounding
 */
export function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates item totals, taxes and invoice aggregates
 */
export function calculateInvoice(
  rawItems: SalesInvoiceItem[],
  charges: AdditionalCharges,
  isInterState: boolean,
  amountPaid: number = 0
): CalculationResult {
  let subtotal = 0;
  let totalDiscount = 0;
  let taxableAmount = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;

  const processedItems = rawItems.map(item => {
    const qty = Math.max(0, Number(item.quantity) || 0);
    const rate = Math.max(0, Number(item.rate) || 0);
    const gross = round2(qty * rate);

    let discAmt = 0;
    if (item.discountPercent > 0) {
      discAmt = round2((gross * Math.min(100, item.discountPercent)) / 100);
    } else if (item.discountAmount > 0) {
      discAmt = round2(Math.min(gross, item.discountAmount));
    }

    const taxable = round2(gross - discAmt);
    const gstRate = Math.max(0, Number(item.gstRate) || 0);

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isInterState) {
      igst = round2((taxable * gstRate) / 100);
    } else {
      const halfRate = gstRate / 2;
      cgst = round2((taxable * halfRate) / 100);
      sgst = round2((taxable * halfRate) / 100);
    }

    const itemTotal = round2(taxable + (isInterState ? igst : cgst + sgst));

    subtotal += gross;
    totalDiscount += discAmt;
    taxableAmount += taxable;
    cgstTotal += cgst;
    sgstTotal += sgst;
    igstTotal += igst;

    return {
      ...item,
      quantity: qty,
      rate,
      discountAmount: discAmt,
      taxableValue: taxable,
      cgstAmount: cgst,
      sgstAmount: sgst,
      igstAmount: igst,
      totalAmount: itemTotal,
    };
  });

  subtotal = round2(subtotal);
  totalDiscount = round2(totalDiscount);
  taxableAmount = round2(taxableAmount);
  cgstTotal = round2(cgstTotal);
  sgstTotal = round2(sgstTotal);
  igstTotal = round2(igstTotal);
  const totalTax = round2(isInterState ? igstTotal : cgstTotal + sgstTotal);

  // Additional charges
  const addChargesSum = round2(
    (charges.transport || 0) +
    (charges.loading || 0) +
    (charges.unloading || 0) +
    (charges.packaging || 0) +
    (charges.other || 0)
  );

  const extraDiscount = round2(charges.discount || 0);

  // Raw unrounded total
  const unroundedGrand = taxableAmount + totalTax + addChargesSum - extraDiscount;

  // Round off to nearest whole rupee if desired, or use manual roundOff
  let calculatedRoundOff = 0;
  let finalGrand = 0;

  if (charges.roundOff !== 0) {
    calculatedRoundOff = charges.roundOff;
    finalGrand = round2(unroundedGrand + calculatedRoundOff);
  } else {
    const rounded = Math.round(unroundedGrand);
    calculatedRoundOff = round2(rounded - unroundedGrand);
    finalGrand = rounded;
  }

  const validAmountPaid = Math.max(0, Math.min(finalGrand, round2(amountPaid)));
  const balanceDue = round2(finalGrand - validAmountPaid);
  const amountInWords = numberToIndianWords(finalGrand);

  return {
    items: processedItems,
    subtotal,
    totalDiscount,
    taxableAmount,
    cgstTotal,
    sgstTotal,
    igstTotal,
    totalTax,
    additionalChargesTotal: addChargesSum,
    roundOff: calculatedRoundOff,
    grandTotal: finalGrand,
    balanceDue,
    amountInWords,
  };
}

/**
 * Validates invoice inputs before generation
 */
export function validateInvoice(
  customerName: string,
  customerPhone: string,
  customerGstin: string | undefined,
  items: SalesInvoiceItem[],
  invoiceDate: string,
  dueDate: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!customerName || customerName.trim().length === 0) {
    issues.push({ field: 'customerName', message: 'Customer name is required' });
  }

  if (!customerPhone || customerPhone.replace(/\D/g, '').length < 10) {
    issues.push({ field: 'customerPhone', message: 'A valid 10-digit mobile number is required' });
  }

  if (customerGstin && customerGstin.trim().length > 0) {
    const gstinClean = customerGstin.trim().toUpperCase();
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstinRegex.test(gstinClean)) {
      issues.push({
        field: 'customerGstin',
        message: 'Invalid GSTIN format (should be 15 alphanumeric characters, e.g. 03AAACG1234F1Z8)',
      });
    }
  }

  if (!items || items.length === 0) {
    issues.push({ field: 'items', message: 'At least one product item row is required' });
  } else {
    items.forEach((item, idx) => {
      if (!item.productName || item.productName.trim().length === 0) {
        issues.push({ field: `item_${idx}_name`, message: `Product name missing in row #${idx + 1}` });
      }
      if (item.quantity <= 0) {
        issues.push({ field: `item_${idx}_qty`, message: `Quantity must be greater than zero in row #${idx + 1}` });
      }
      if (item.rate <= 0) {
        issues.push({ field: `item_${idx}_rate`, message: `Rate must be greater than zero in row #${idx + 1}` });
      }
      if (item.discountPercent < 0 || item.discountPercent > 100) {
        issues.push({ field: `item_${idx}_disc`, message: `Discount % must be between 0 and 100 in row #${idx + 1}` });
      }
    });
  }

  if (!invoiceDate) {
    issues.push({ field: 'invoiceDate', message: 'Invoice date is required' });
  }

  if (dueDate && invoiceDate && dueDate < invoiceDate) {
    issues.push({ field: 'dueDate', message: 'Payment due date cannot precede invoice date' });
  }

  return issues;
}

/**
 * Converts a numeric amount to Indian Currency Words
 * Example: 145280 -> "Rupees One Lakh Forty Five Thousand Two Hundred Eighty Only"
 */
export function numberToIndianWords(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Rupees Zero Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teenDigits = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tensDigits = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n: number): string {
    if (n === 0) return '';
    if (n < 10) return singleDigits[n];
    if (n < 20) return teenDigits[n - 10];
    const tens = Math.floor(n / 10);
    const units = n % 10;
    return `${tensDigits[tens]}${units > 0 ? ' ' + singleDigits[units] : ''}`;
  }

  function convertThreeDigits(n: number): string {
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    let res = '';
    if (hundreds > 0) {
      res += `${singleDigits[hundreds]} Hundred`;
    }
    if (remainder > 0) {
      if (res) res += ' ';
      res += convertTwoDigits(remainder);
    }
    return res;
  }

  const rounded = round2(Math.abs(amount));
  const integerPart = Math.floor(rounded);
  const paisePart = Math.round((rounded - integerPart) * 100);

  let words = '';

  const crore = Math.floor(integerPart / 10000000);
  const lakh = Math.floor((integerPart % 10000000) / 100000);
  const thousand = Math.floor((integerPart % 100000) / 1000);
  const remainder = integerPart % 1000;

  if (crore > 0) {
    words += `${convertTwoDigits(crore)} Crore `;
  }
  if (lakh > 0) {
    words += `${convertTwoDigits(lakh)} Lakh `;
  }
  if (thousand > 0) {
    words += `${convertTwoDigits(thousand)} Thousand `;
  }
  if (remainder > 0) {
    words += `${convertThreeDigits(remainder)} `;
  }

  words = words.trim();
  if (!words) words = 'Zero';

  let result = `Rupees ${words}`;

  if (paisePart > 0) {
    result += ` and ${convertTwoDigits(paisePart)} Paise`;
  }

  return `${result} Only`;
}
