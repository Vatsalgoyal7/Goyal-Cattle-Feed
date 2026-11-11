import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateInvoice,
  validateInvoice,
  numberToIndianWords,
  round2,
} from '../src/utils/billingCalculations.ts';
import { SalesInvoiceItem, AdditionalCharges } from '../src/types/index.ts';

test('round2 correctly rounds to 2 decimal places', () => {
  assert.equal(round2(10.255), 10.26);
  assert.equal(round2(10.254), 10.25);
  assert.equal(round2(100), 100);
});

test('calculateInvoice intra-state divides GST into CGST and SGST', () => {
  const items: SalesInvoiceItem[] = [
    {
      id: 'item-1',
      productName: 'Goyal Premium Feed (50kg)',
      sku: 'GPF-50KG',
      hsn: '23099010',
      quantity: 100,
      unit: 'Bag',
      rate: 1650,
      discountPercent: 0,
      discountAmount: 0,
      taxableValue: 0,
      gstRate: 5,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      totalAmount: 0,
    },
  ];

  const charges: AdditionalCharges = {
    transport: 1200,
    loading: 500,
    unloading: 0,
    packaging: 0,
    other: 0,
    discount: 0,
    roundOff: 0,
  };

  const result = calculateInvoice(items, charges, false, 50000);

  // 100 * 1650 = 165000 taxable
  assert.equal(result.taxableAmount, 165000);
  // 5% GST = 8250, split into 4125 CGST and 4125 SGST
  assert.equal(result.cgstTotal, 4125);
  assert.equal(result.sgstTotal, 4125);
  assert.equal(result.igstTotal, 0);
  assert.equal(result.additionalChargesTotal, 1700);
  // 165000 + 8250 + 1700 = 174950
  assert.equal(result.grandTotal, 174950);
  // Paid 50000, balance 124950
  assert.equal(result.balanceDue, 124950);
});

test('calculateInvoice inter-state applies IGST only', () => {
  const items: SalesInvoiceItem[] = [
    {
      id: 'item-1',
      productName: 'Goyal Super Dairy Cattle Feed (50kg)',
      sku: 'GSD-50KG',
      hsn: '23099010',
      quantity: 50,
      unit: 'Bag',
      rate: 1720,
      discountPercent: 2, // 2% discount on 86000 = 1720
      discountAmount: 0,
      taxableValue: 0,
      gstRate: 5,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      totalAmount: 0,
    },
  ];

  const charges: AdditionalCharges = {
    transport: 2500,
    loading: 0,
    unloading: 0,
    packaging: 0,
    other: 0,
    discount: 0,
    roundOff: 0,
  };

  const result = calculateInvoice(items, charges, true, 0);

  // Subtotal = 86000, Disc = 1720, Taxable = 84280
  assert.equal(result.subtotal, 86000);
  assert.equal(result.totalDiscount, 1720);
  assert.equal(result.taxableAmount, 84280);
  assert.equal(result.cgstTotal, 0);
  assert.equal(result.sgstTotal, 0);
  assert.equal(result.igstTotal, 4214); // 5% of 84280
  // 84280 + 4214 + 2500 = 90994
  assert.equal(result.grandTotal, 90994);
});

test('numberToIndianWords produces accurate Indian rupee terminology', () => {
  assert.equal(
    numberToIndianWords(145280),
    'Rupees One Lakh Forty Five Thousand Two Hundred Eighty Only'
  );
  assert.equal(
    numberToIndianWords(1500000),
    'Rupees Fifteen Lakh Only'
  );
  assert.equal(
    numberToIndianWords(25000000),
    'Rupees Two Crore Fifty Lakh Only'
  );
});

test('validateInvoice checks customer and item integrity', () => {
  const issues = validateInvoice('', '123', 'INVALIDGSTIN', [], '2026-11-11', '2026-11-10');
  assert.ok(issues.some(i => i.field === 'customerName'));
  assert.ok(issues.some(i => i.field === 'customerPhone'));
  assert.ok(issues.some(i => i.field === 'customerGstin'));
  assert.ok(issues.some(i => i.field === 'items'));
  assert.ok(issues.some(i => i.field === 'dueDate'));
});
