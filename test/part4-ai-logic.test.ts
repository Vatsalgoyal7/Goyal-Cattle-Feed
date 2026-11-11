import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseAIBusinessIntent,
  calculateGstReconciliation,
  generateEwayBillJson,
  detectDuplicateInvoice,
  calculateStockIntelligence,
} from '../src/utils/aiAndOperationsLogic';

test('parseAIBusinessIntent parses Hinglish stock in statement with bags and weight', () => {
  const mockContext = {
    products: [
      { id: 'p1', name: 'Goyal Premium Cattle Feed (50kg)', sku: 'GCF-PREM-50' },
      { id: 'p2', name: 'Vinole ki Khal (Cottonseed Cake)', sku: 'RAW-CS-01' },
    ],
    warehouses: [
      { id: 'w1', name: 'Plant 1 - Main Feed Mill & Godown', code: 'WH-MAIN' },
      { id: 'w2', name: 'Warehouse 1', code: 'WH-01' },
    ],
    customers: [{ id: 'c1', name: 'Sharma Traders', firmName: 'Sharma Traders' }],
  };

  const input = 'Aaj Warehouse 1 mein Vinole ki Khal ke 50 katte aaye hain, har katta 40 kg ka hai.';
  const result = parseAIBusinessIntent(input, mockContext);

  assert.equal(result.actionType, 'EXECUTE');
  assert.equal(result.subType, 'Stock In');
  assert.equal(result.productName, 'Vinole ki Khal (Cottonseed Cake)');
  assert.equal(result.warehouseName, 'Warehouse 1');
  assert.equal(result.numberOfBags, 50);
  assert.equal(result.bagWeightKg, 40);
  assert.equal(result.totalWeightKg, 2000);
});

test('parseAIBusinessIntent detects REMEMBER action for credit terms', () => {
  const mockContext = { products: [], warehouses: [], customers: [] };
  const input = 'Yaad rakhna ki Sharma Traders ko usually 30 days ka credit dete hain.';
  const result = parseAIBusinessIntent(input, mockContext);

  assert.equal(result.actionType, 'REMEMBER');
  assert.equal(result.memoryCategory, 'Credit Terms');
  assert.ok(result.content.includes('Sharma Traders'));
});

test('parseAIBusinessIntent detects REMIND action for follow up', () => {
  const mockContext = { products: [], warehouses: [], customers: [] };
  const input = 'Kal subah 10 baje supplier ko payment ke liye remind karna.';
  const result = parseAIBusinessIntent(input, mockContext);

  assert.equal(result.actionType, 'REMIND');
  assert.ok(result.taskTitle.toLowerCase().includes('supplier'));
});

test('calculateGstReconciliation computes output tax, ITC, and net liability', () => {
  const mockInvoices = [
    { taxableAmount: 100000, cgstTotal: 2500, sgstTotal: 2500, igstTotal: 0 },
    { taxableAmount: 200000, cgstTotal: 0, sgstTotal: 0, igstTotal: 10000 },
  ];
  const mockPurchases = [
    { subtotal: 150000, totalTax: 7500 }, // ITC
  ];

  const result = calculateGstReconciliation(mockInvoices, mockPurchases);

  assert.equal(result.totalOutputTax, 15000); // 2500 + 2500 + 10000
  assert.equal(result.totalInputTaxCredit, 7500);
  assert.equal(result.netGstPayable, 7500);
  assert.equal(result.status, 'Tax Payable');
});

test('detectDuplicateInvoice identifies duplicate invoice numbers for same supplier', () => {
  const existingInvoices = [
    { supplierInvoiceNumber: 'INV-8821', supplierId: 'SUPP-01' },
    { supplierInvoiceNumber: 'INV-9900', supplierId: 'SUPP-02' },
  ];

  assert.equal(detectDuplicateInvoice(existingInvoices, 'INV-8821', 'SUPP-01'), true);
  assert.equal(detectDuplicateInvoice(existingInvoices, 'INV-8821', 'SUPP-02'), false);
  assert.equal(detectDuplicateInvoice(existingInvoices, 'INV-1111', 'SUPP-01'), false);
});

test('calculateStockIntelligence identifies low stock and suggests reorder', () => {
  const mockProducts = [
    { id: 'p1', name: 'Yellow Maize', currentStock: 300, minimumStock: 500, unit: 'Quintal' },
    { id: 'p2', name: 'Goyal Premium Feed', currentStock: 1200, minimumStock: 400, unit: 'Bags (50kg)' },
  ];

  const intel = calculateStockIntelligence(mockProducts, []);
  assert.equal(intel.lowStockItems.length, 1);
  assert.equal(intel.lowStockItems[0].name, 'Yellow Maize');
  assert.equal(intel.lowStockItems[0].shortage, 200);
  assert.equal(intel.lowStockItems[0].suggestedReorder, 700); // shortage 200 + buffer 500
});
