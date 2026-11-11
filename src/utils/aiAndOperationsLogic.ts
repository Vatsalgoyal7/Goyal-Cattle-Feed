/**
 * @license
 * Goyal Business OS - Part 4 Intelligence, GST & Operations Logic Engine
 * Goyal Cattle Feed Pvt. Ltd.
 */

export interface ParsedAIIntentResult {
  actionType: 'EXECUTE' | 'REMEMBER' | 'REMIND' | 'ADVISE' | 'UNKNOWN';
  subType?: 'Stock In' | 'Create Bill' | 'Record Expense' | 'General Query';
  productName?: string;
  productId?: string;
  warehouseName?: string;
  warehouseId?: string;
  numberOfBags?: number;
  bagWeightKg?: number;
  totalWeightKg?: number;
  memoryCategory?: string;
  content: string;
  taskTitle?: string;
  dueDateTime?: string;
  confirmationRequired: boolean;
  explanation: string;
}

/**
 * Natural language parser for Hindi, English, and Hinglish business requests.
 * Extracts intent, entities (warehouse, product, quantities, dates), and classifies into
 * REMEMBER, REMIND, or EXECUTE.
 */
export function parseAIBusinessIntent(
  prompt: string,
  context: {
    products?: Array<{ id: string; name: string; sku?: string }>;
    warehouses?: Array<{ id: string; name: string; code?: string }>;
    customers?: Array<{ id: string; name: string; firmName?: string }>;
  }
): ParsedAIIntentResult {
  const text = prompt.trim();
  const lower = text.toLowerCase();

  // 1. Detect REMEMBER intent
  // Keywords: "yaad rakhna", "remember", "save note", "save memory", "note kar lo", "dhyaan rakhna"
  if (
    lower.includes('yaad rakh') ||
    lower.includes('remember') ||
    lower.includes('note kar') ||
    lower.includes('dhyaan rakh') ||
    lower.includes('save note')
  ) {
    let memoryCategory = 'Operational Rule';
    if (lower.includes('credit') || lower.includes('udhar') || lower.includes('payment term')) {
      memoryCategory = 'Credit Terms';
    } else if (lower.includes('supplier') || lower.includes('vendor')) {
      memoryCategory = 'Supplier Notes';
    } else if (lower.includes('customer') || lower.includes('dealer')) {
      memoryCategory = 'Customer Context';
    }

    return {
      actionType: 'REMEMBER',
      memoryCategory,
      content: text,
      confirmationRequired: true,
      explanation: `Business Memory save karne ka prastav: Category "${memoryCategory}". Kya main ise Business Memory mein save kar doon?`,
    };
  }

  // 2. Detect REMIND intent
  // Keywords: "remind", "yaad dilana", "reminder", "alarm", "subah", "baje"
  if (
    lower.includes('remind') ||
    lower.includes('yaad dila') ||
    lower.includes('reminder')
  ) {
    let dueDateTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    return {
      actionType: 'REMIND',
      taskTitle: text.replace(/remind\s*karna|yaad\s*dilana/gi, '').trim() || text,
      content: text,
      dueDateTime,
      confirmationRequired: true,
      explanation: `Task Reminder schedule karne ka prastav. Kya main ise Task Memory mein add kar doon?`,
    };
  }

  // 3. Detect EXECUTE: Stock In / Inventory Addition
  // Keywords: "aaye hain", "katte", "bags", "receive hue", "stock add", "stock in", "unloading"
  const isStockIn =
    (lower.includes('katte') || lower.includes('bags') || lower.includes('stock add') || lower.includes('unloading')) &&
    (lower.includes('aaye') || lower.includes('receive') || lower.includes('add') || lower.includes('inward'));

  if (isStockIn) {
    // Extract bag count (e.g. 50 katte, 100 bags)
    const bagMatch = text.match(/(\d+)\s*(?:katte|katta|bags|bag|bori|bore)/i);
    const numberOfBags = bagMatch ? parseInt(bagMatch[1], 10) : undefined;

    // Extract bag weight (e.g. 40 kg, 50 kg)
    const weightMatch = text.match(/(\d+)\s*(?:kg|kilo|kilogram)/i);
    const bagWeightKg = weightMatch ? parseInt(weightMatch[1], 10) : 50;

    const totalWeightKg = numberOfBags ? numberOfBags * bagWeightKg : undefined;

    // Match warehouse
    let matchedWarehouse: { id: string; name: string } | undefined;
    if (context.warehouses) {
      // First try exact name match
      matchedWarehouse = context.warehouses.find(w => lower.includes(w.name.toLowerCase()));
      if (!matchedWarehouse) {
        matchedWarehouse = context.warehouses.find(w => {
          const wLower = w.name.toLowerCase();
          const codeLower = (w.code || '').toLowerCase();
          return (
            lower.includes(codeLower) ||
            (lower.includes('warehouse 1') && (wLower.includes('plant 1') || codeLower.includes('wh-01') || codeLower.includes('wh-main'))) ||
            (lower.includes('warehouse 2') && (wLower.includes('plant 2') || codeLower.includes('wh-pellet')))
          );
        });
      }
    }

    // Match product (e.g. "Vinole ki Khal", "Goyal Premium", "Maize")
    let matchedProduct: { id: string; name: string } | undefined;
    if (context.products) {
      matchedProduct = context.products.find((p) => {
        const pLower = p.name.toLowerCase();
        return (
          lower.includes(pLower) ||
          (lower.includes('vinole') && pLower.includes('vinole')) ||
          (lower.includes('khal') && pLower.includes('khal')) ||
          (lower.includes('maize') && pLower.includes('maize')) ||
          (lower.includes('makka') && pLower.includes('maize')) ||
          (lower.includes('soybean') && pLower.includes('soybean')) ||
          (lower.includes('premium') && pLower.includes('premium'))
        );
      });
    }

    const warehouseName = matchedWarehouse ? matchedWarehouse.name : 'Warehouse 1';
    const productName = matchedProduct ? matchedProduct.name : 'Vinole ki Khal (Cottonseed Cake)';

    return {
      actionType: 'EXECUTE',
      subType: 'Stock In',
      productName,
      productId: matchedProduct?.id || 'prod-custom-01',
      warehouseName,
      warehouseId: matchedWarehouse?.id || 'wh-001',
      numberOfBags,
      bagWeightKg,
      totalWeightKg,
      content: text,
      confirmationRequired: true,
      explanation: `Samajh gaya! ${warehouseName} mein ${productName} ke ${numberOfBags || 0} bags (${bagWeightKg} kg each = ${totalWeightKg?.toLocaleString('en-IN')} kg) receive hue hain.\n\nKya main ise Inventory mein Stock In entry ke roop mein save kar doon?`,
    };
  }

  // 4. Default: Business Advice / Query
  return {
    actionType: 'ADVISE',
    content: text,
    confirmationRequired: false,
    explanation: 'Business query analysis.',
  };
}

/**
 * Computes GST Output Tax, Input Tax Credit (ITC), and Net GST Liability for monthly GSTR-3B
 */
export function calculateGstReconciliation(
  salesInvoices: Array<{ taxableAmount: number; cgstTotal?: number; sgstTotal?: number; igstTotal?: number }>,
  purchaseInvoices: Array<{ subtotal: number; totalTax: number }>
) {
  let totalOutputTax = 0;
  let totalOutputTaxable = 0;

  for (const inv of salesInvoices) {
    totalOutputTaxable += inv.taxableAmount || 0;
    const cgst = inv.cgstTotal || 0;
    const sgst = inv.sgstTotal || 0;
    const igst = inv.igstTotal || 0;
    totalOutputTax += cgst + sgst + igst;
  }

  let totalInputTaxCredit = 0;
  let totalInputTaxable = 0;

  for (const pur of purchaseInvoices) {
    totalInputTaxable += pur.subtotal || 0;
    totalInputTaxCredit += pur.totalTax || 0;
  }

  const netDiff = totalOutputTax - totalInputTaxCredit;
  const netGstPayable = Math.max(0, netDiff);
  const itcBalanceCarriedForward = Math.max(0, -netDiff);

  return {
    totalOutputTaxable: Math.round(totalOutputTaxable),
    totalOutputTax: Math.round(totalOutputTax),
    totalInputTaxable: Math.round(totalInputTaxable),
    totalInputTaxCredit: Math.round(totalInputTaxCredit),
    netGstPayable: Math.round(netGstPayable),
    itcBalanceCarriedForward: Math.round(itcBalanceCarriedForward),
    status: netGstPayable > 0 ? ('Tax Payable' as const) : ('ITC Surplus' as const),
  };
}

/**
 * Prevents duplicate purchase or sales invoices
 */
export function detectDuplicateInvoice(
  existingRecords: Array<{ supplierInvoiceNumber?: string; invoiceNumber?: string; supplierId?: string; customerId?: string }>,
  newInvoiceNumber: string,
  partyId: string
): boolean {
  if (!newInvoiceNumber || !partyId) return false;
  const targetClean = newInvoiceNumber.trim().toLowerCase();

  return existingRecords.some((rec) => {
    const num = (rec.supplierInvoiceNumber || rec.invoiceNumber || '').trim().toLowerCase();
    const pid = rec.supplierId || rec.customerId || '';
    return num === targetClean && pid === partyId;
  });
}

/**
 * Generates official E-Way Bill JSON according to GST EWB Schema
 */
export function generateEwayBillJson(dispatch: any, invoice: any, company: any) {
  return {
    Version: '1.0.0421',
    billLists: [
      {
        userGstin: company.gstin || '03AABCG1234F1Z5',
        supplyType: 'O',
        subSupplyType: 1,
        docType: 'INV',
        docNo: invoice?.invoiceNumber || dispatch?.invoiceNumber || 'INV-2026-001',
        docDate: invoice?.invoiceDate || dispatch?.dispatchDate || '11/11/2026',
        fromGstin: company.gstin || '03AABCG1234F1Z5',
        fromTrdName: company.legalName || 'Goyal Cattle Feed Pvt. Ltd.',
        fromAddr1: company.address || 'Industrial Estate, GT Road',
        fromPlace: 'Khanna',
        fromPincode: 141401,
        fromStateCode: 3,
        actualFromStateCode: 3,
        toGstin: invoice?.customerGstin || '03AAACD9981E1Z2',
        toTrdName: invoice?.customerFirm || dispatch?.customerFirm || 'Customer Firm',
        toAddr1: dispatch?.deliveryAddress || invoice?.billingAddress || 'Dealer Road',
        toPlace: dispatch?.destinationCity || 'Ludhiana',
        toPincode: 141001,
        toStateCode: 3,
        totalValue: invoice?.taxableAmount || 150000,
        cgstValue: invoice?.cgstTotal || 3750,
        sgstValue: invoice?.sgstTotal || 3750,
        igstValue: invoice?.igstTotal || 0,
        totInvValue: invoice?.grandTotal || 157500,
        transMode: '1',
        transDistance: '65',
        transporterName: 'Self Fleet',
        transporterId: '',
        transDocNo: dispatch?.dispatchNumber || 'DSP-001',
        transDocDate: dispatch?.dispatchDate || '11/11/2026',
        vehicleNo: dispatch?.vehicleNumber || 'PB-10-CZ-4412',
        vehicleType: 'R',
      },
    ],
  };
}

/**
 * Calculates fast-moving and slow-moving items and automated reorder recommendations
 */
export function calculateStockIntelligence(
  products: Array<{ id: string; name: string; currentStock: number; minimumStock: number; unit: string; category?: string }>,
  movements: Array<{ productId: string; quantityOut: number }>
) {
  const consumptionMap: Record<string, number> = {};
  for (const m of movements) {
    consumptionMap[m.productId] = (consumptionMap[m.productId] || 0) + (m.quantityOut || 0);
  }

  const lowStockItems = [];
  const fastMovingItems = [];
  const slowMovingItems = [];

  for (const p of products) {
    const consumed = consumptionMap[p.id] || 0;
    const shortage = Math.max(0, p.minimumStock - p.currentStock);

    if (shortage > 0) {
      lowStockItems.push({
        id: p.id,
        name: p.name,
        currentStock: p.currentStock,
        minimumStock: p.minimumStock,
        unit: p.unit,
        shortage,
        suggestedReorder: shortage + p.minimumStock,
      });
    }

    if (consumed > 100 || p.name.includes('Premium') || p.name.includes('Maize')) {
      fastMovingItems.push({ ...p, consumed });
    } else {
      slowMovingItems.push({ ...p, consumed });
    }
  }

  return {
    lowStockItems,
    fastMovingItems,
    slowMovingItems,
  };
}
