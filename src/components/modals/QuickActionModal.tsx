import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileText,
  ShoppingCart,
  PackagePlus,
  UserPlus,
  DollarSign,
  Receipt,
  UserCheck,
  Factory,
  CheckCircle,
} from 'lucide-react';
import { formatIndianCurrency } from '../../data/sampleData';

export const QuickActionModal: React.FC = () => {
  const {
    activeQuickAction,
    setActiveQuickAction,
    customers,
    products,
    addTransaction,
    addActivity,
    t,
  } = useApp();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  // 1. Sales Bill
  const [salesCustomer, setSalesCustomer] = useState(customers[0]?.id || '');
  const [salesProduct, setSalesProduct] = useState(products[0]?.id || '');
  const [salesQty, setSalesQty] = useState('100');
  const [salesRate, setSalesRate] = useState('1680');
  const [salesPaymentType, setSalesPaymentType] = useState<'Paid' | 'Credit' | 'Partial'>('Paid');

  // 2. Add Purchase
  const [purchaseSupplier, setPurchaseSupplier] = useState('Aggarwal Grain Millers');
  const [purchaseItem, setPurchaseItem] = useState('Yellow Maize (Dry Corn)');
  const [purchaseQty, setPurchaseQty] = useState('20'); // MT
  const [purchaseRate, setPurchaseRate] = useState('22800'); // per MT

  // 3. Add Stock
  const [stockProduct, setStockProduct] = useState(products[0]?.id || '');
  const [stockQty, setStockQty] = useState('200');
  const [stockWarehouse, setStockWarehouse] = useState('Plant 1 - Finished Goods Godown');

  // 4. Add Customer
  const [custFirmName, setCustFirmName] = useState('');
  const [custContactPerson, setCustContactPerson] = useState('');
  const [custCity, setCustCity] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCreditLimit, setCustCreditLimit] = useState('500000');

  // 5. Receive Payment
  const [paymentCustomer, setPaymentCustomer] = useState(customers[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState('50000');
  const [paymentMode, setPaymentMode] = useState<'NEFT/RTGS' | 'UPI' | 'Cheque' | 'Cash'>('UPI');
  const [paymentRef, setPaymentRef] = useState('');

  // 6. Add Expense
  const [expenseCategory, setExpenseCategory] = useState('Factory Labour & Wages');
  const [expenseAmount, setExpenseAmount] = useState('8500');
  const [expenseDescription, setExpenseDescription] = useState('Daily shift overtime allowance');

  // 7. Mark Attendance
  const [shift, setShift] = useState<'Morning (8 AM - 4 PM)' | 'Evening (4 PM - 12 AM)' | 'Night (12 AM - 8 AM)'>('Morning (8 AM - 4 PM)');
  const [workerCount, setWorkerCount] = useState('42');
  const [operatorCount, setOperatorCount] = useState('6');

  // 8. Production Entry
  const [prodBatchNumber, setProdBatchNumber] = useState(`GCF-BATCH-${Math.floor(1000 + Math.random() * 9000)}`);
  const [prodProduct, setProdProduct] = useState(products[0]?.name || '');
  const [prodBagsProduced, setProdBagsProduced] = useState('300');
  const [prodLine, setProdLine] = useState('Pellet Line 1 (Main Mill)');

  if (!activeQuickAction) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
      setActiveQuickAction(null);
    }, 1200);
  };

  const handleSalesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === salesCustomer) || customers[0];
    const total = parseFloat(salesQty) * parseFloat(salesRate);
    const invoiceNum = `INV/2026/0${Math.floor(420 + Math.random() * 80)}`;

    addTransaction({
      invoiceNumber: invoiceNum,
      partyName: cust.firmName,
      date: '11/11/2026',
      type: 'Sales',
      amount: total,
      status: salesPaymentType,
      branch: 'Plant 1',
    });

    addActivity(
      'Generated Sales Invoice',
      `${invoiceNum} for ${cust.firmName} (${formatIndianCurrency(total)})`,
      'Sales'
    );

    showToast(`Invoice ${invoiceNum} created for ${formatIndianCurrency(total)}`);
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = parseFloat(purchaseQty) * parseFloat(purchaseRate);
    const purNum = `PUR/2026/0${Math.floor(200 + Math.random() * 80)}`;

    addTransaction({
      invoiceNumber: purNum,
      partyName: purchaseSupplier,
      date: '11/11/2026',
      type: 'Purchase',
      amount: total,
      status: 'Paid',
      branch: 'Central Silos',
    });

    addActivity(
      'Recorded Raw Material Purchase',
      `${purNum} from ${purchaseSupplier} (${purchaseQty} MT · ${formatIndianCurrency(total)})`,
      'Purchase'
    );

    showToast(`Purchase order ${purNum} booked successfully!`);
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prd = products.find(p => p.id === stockProduct) || products[0];
    addActivity(
      'Stock Inward Updated',
      `Added ${stockQty} ${prd.unit} of ${prd.name} at ${stockWarehouse}`,
      'Inventory'
    );
    showToast(`Added ${stockQty} ${prd.unit} to stock records.`);
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custFirmName.trim()) return;
    addActivity(
      'Registered New Customer',
      `${custFirmName} (${custCity || 'Punjab'}) · Credit: ${formatIndianCurrency(parseFloat(custCreditLimit) || 0)}`,
      'Sales'
    );
    showToast(`Customer "${custFirmName}" registered in Khata.`);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === paymentCustomer) || customers[0];
    const recNum = `REC/2026/0${Math.floor(890 + Math.random() * 80)}`;
    const amt = parseFloat(paymentAmount) || 0;

    addTransaction({
      invoiceNumber: recNum,
      partyName: cust.firmName,
      date: '11/11/2026',
      type: 'Receipt',
      amount: amt,
      status: 'Paid',
      branch: 'Plant 1',
    });

    addActivity(
      'Payment Received (Khata)',
      `${recNum}: ${formatIndianCurrency(amt)} via ${paymentMode} from ${cust.firmName}`,
      'Accounts'
    );

    showToast(`Payment of ${formatIndianCurrency(amt)} credited to account.`);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(expenseAmount) || 0;
    const vchNum = `EXP/2026/0${Math.floor(100 + Math.random() * 900)}`;

    addTransaction({
      invoiceNumber: vchNum,
      partyName: expenseCategory,
      date: '11/11/2026',
      type: 'Payment',
      amount: amt,
      status: 'Paid',
      branch: 'Plant 1',
    });

    addActivity(
      'Factory Expense Voucher',
      `${expenseCategory} - ${expenseDescription} (${formatIndianCurrency(amt)})`,
      'Accounts'
    );

    showToast(`Expense voucher ${vchNum} for ${formatIndianCurrency(amt)} logged.`);
  };

  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addActivity(
      'Shift Attendance Submitted',
      `${shift}: ${workerCount} Workers + ${operatorCount} Machine Operators present`,
      'Production'
    );
    showToast(`Attendance for ${workerCount} workers marked successfully.`);
  };

  const handleProductionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addActivity(
      'Production Batch Logged',
      `${prodBatchNumber}: ${prodBagsProduced} Bags of ${prodProduct} produced on ${prodLine}`,
      'Production'
    );
    showToast(`Batch ${prodBatchNumber} recorded into finished goods inventory.`);
  };

  const getActionConfig = () => {
    switch (activeQuickAction) {
      case 'create_sales_bill':
        return {
          title: t.createSalesBill,
          icon: FileText,
          color: 'text-emerald-700 dark:text-emerald-400',
          desc: 'Generate tax invoice, calculate GST, and update dealer khata',
        };
      case 'add_purchase':
        return {
          title: t.addPurchase,
          icon: ShoppingCart,
          color: 'text-blue-700 dark:text-blue-400',
          desc: 'Record incoming raw materials (Maize, Soybean DOC, Mustard Cake)',
        };
      case 'add_stock':
        return {
          title: t.addStock,
          icon: PackagePlus,
          color: 'text-indigo-700 dark:text-indigo-400',
          desc: 'Adjust inward bags or transfer inventory between godowns',
        };
      case 'add_customer':
        return {
          title: t.addCustomer,
          icon: UserPlus,
          color: 'text-purple-700 dark:text-purple-400',
          desc: 'Add dealer or dairy farm with credit limit and billing details',
        };
      case 'receive_payment':
        return {
          title: t.receivePayment,
          icon: DollarSign,
          color: 'text-emerald-700 dark:text-emerald-400',
          desc: 'Record cash, cheque, UPI or NEFT collection from customer',
        };
      case 'add_expense':
        return {
          title: t.addExpense,
          icon: Receipt,
          color: 'text-amber-700 dark:text-amber-400',
          desc: 'Record factory overheads (electricity, labour, maintenance, diesel)',
        };
      case 'mark_attendance':
        return {
          title: t.markAttendance,
          icon: UserCheck,
          color: 'text-cyan-700 dark:text-cyan-400',
          desc: 'Shift-wise factory labour muster and operator attendance log',
        };
      case 'production_entry':
        return {
          title: t.productionEntry,
          icon: Factory,
          color: 'text-teal-700 dark:text-teal-400',
          desc: 'Log pellet mill output, batch number, and bags packed',
        };
      default:
        return {
          title: 'Quick Action',
          icon: FileText,
          color: 'text-slate-700',
          desc: 'Enterprise workflow action',
        };
    }
  };

  const config = getActionConfig();
  const IconComp = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              <IconComp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {config.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {config.desc}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveQuickAction(null)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast banner */}
        {toastMessage && (
          <div className="mx-5 mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Content body based on action */}
        <div className="p-5">
          {/* 1. SALES BILL */}
          {activeQuickAction === 'create_sales_bill' && (
            <form onSubmit={handleSalesSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Select Customer / Dealer
                </label>
                <select
                  value={salesCustomer}
                  onChange={e => setSalesCustomer(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.firmName} ({c.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Feed Product
                </label>
                <select
                  value={salesProduct}
                  onChange={e => {
                    setSalesProduct(e.target.value);
                    const prd = products.find(p => p.id === e.target.value);
                    if (prd) setSalesRate(String(prd.ratePerUnit));
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.ratePerUnit}/{p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Quantity (Bags)
                  </label>
                  <input
                    type="number"
                    value={salesQty}
                    onChange={e => setSalesQty(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Rate per Bag (₹)
                  </label>
                  <input
                    type="number"
                    value={salesRate}
                    onChange={e => setSalesRate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Total Taxable Value:</span>
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
                  {formatIndianCurrency((parseFloat(salesQty) || 0) * (parseFloat(salesRate) || 0))}
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Payment Terms
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Paid', 'Credit', 'Partial'] as const).map(mode => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setSalesPaymentType(mode)}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        salesPaymentType === mode
                          ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveQuickAction(null)}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          )}

          {/* 2. ADD PURCHASE */}
          {activeQuickAction === 'add_purchase' && (
            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Supplier / Miller Name
                </label>
                <input
                  type="text"
                  value={purchaseSupplier}
                  onChange={e => setPurchaseSupplier(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Raw Material Item
                </label>
                <select
                  value={purchaseItem}
                  onChange={e => setPurchaseItem(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Yellow Maize (Dry Corn)">Yellow Maize (Dry Corn)</option>
                  <option value="Soybean Meal (DOC 48% Protein)">Soybean Meal (DOC 48% Protein)</option>
                  <option value="Mustard Cake (Kachi Ghani)">Mustard Cake (Kachi Ghani)</option>
                  <option value="De-oiled Rice Bran (DORB)">De-oiled Rice Bran (DORB)</option>
                  <option value="Wheat Bran (Choker)">Wheat Bran (Choker)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Quantity (Metric Tonnes)
                  </label>
                  <input
                    type="number"
                    value={purchaseQty}
                    onChange={e => setPurchaseQty(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Rate per MT (₹)
                  </label>
                  <input
                    type="number"
                    value={purchaseRate}
                    onChange={e => setPurchaseRate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Total Purchase Value:</span>
                <span className="text-base font-bold text-blue-700 dark:text-blue-400 font-mono tabular-nums">
                  {formatIndianCurrency((parseFloat(purchaseQty) || 0) * (parseFloat(purchaseRate) || 0))}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveQuickAction(null)}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs"
                >
                  Save Purchase Record
                </button>
              </div>
            </form>
          )}

          {/* 3. ADD STOCK */}
          {activeQuickAction === 'add_stock' && (
            <form onSubmit={handleStockSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Product to Inward
                </label>
                <select
                  value={stockProduct}
                  onChange={e => setStockProduct(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current: {p.currentStock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Quantity Inward
                  </label>
                  <input
                    type="number"
                    value={stockQty}
                    onChange={e => setStockQty(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Destination Godown
                  </label>
                  <select
                    value={stockWarehouse}
                    onChange={e => setStockWarehouse(e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Plant 1 - Finished Goods Godown">Plant 1 - Finished Goods</option>
                    <option value="Plant 2 - Pellet Storage Yard">Plant 2 - Pellet Yard</option>
                    <option value="Central Grain Silos Hub">Central Grain Silos Hub</option>
                    <option value="Rohtak Regional Depot">Rohtak Regional Depot</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveQuickAction(null)}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white shadow-xs"
                >
                  Update Inventory
                </button>
              </div>
            </form>
          )}

          {/* 4. ADD CUSTOMER */}
          {activeQuickAction === 'add_customer' && (
            <form onSubmit={handleCustomerSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Firm / Dairy Farm Name
                </label>
                <input
                  type="text"
                  value={custFirmName}
                  onChange={e => setCustFirmName(e.target.value)}
                  placeholder="e.g. Modern Kisan Dairy Farm"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={custContactPerson}
                    onChange={e => setCustContactPerson(e.target.value)}
                    placeholder="Owner name"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    value={custCity}
                    onChange={e => setCustCity(e.target.value)}
                    placeholder="e.g. Khanna"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={custPhone}
                    onChange={e => setCustPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Credit Limit (₹)
                  </label>
                  <input
                    type="number"
                    value={custCreditLimit}
                    onChange={e => setCustCreditLimit(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveQuickAction(null)}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                >
                  Save Customer Khata
                </button>
              </div>
            </form>
          )}

          {/* 5. RECEIVE PAYMENT */}
          {activeQuickAction === 'receive_payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Customer / Dealer
                </label>
                <select
                  value={paymentCustomer}
                  onChange={e => setPaymentCustomer(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.firmName} · Due: {formatIndianCurrency(c.outstandingAmount)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Amount Received (₹)
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="NEFT/RTGS">NEFT / RTGS (Bank Transfer)</option>
                    <option value="Cheque">Bank Cheque</option>
                    <option value="Cash">Cash in Hand</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Bank UTR / Reference No.
                </label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={e => setPaymentRef(e.target.value)}
                  placeholder="Optional reference number"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveQuickAction(null)}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                >
                  Record Receipt Voucher
                </button>
              </div>
            </form>
          )}

          {/* 6. ADD EXPENSE */}
          {activeQuickAction === 'add_expense' && (
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Expense Category
                </label>
                <select
                  value={expenseCategory}
                  onChange={e => setExpenseCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Electricity & Power">Electricity & Power</option>
                  <option value="Factory Labour & Wages">Factory Labour & Wages</option>
                  <option value="Transport & Freight">Transport & Freight (Truck Bhada)</option>
                  <option value="Boiler Fuel & Biomass">Boiler Fuel & Biomass</option>
                  <option value="Machine Maintenance">Machine Maintenance & Spare Parts</option>
                  <option value="Other Factory Overheads">Other Overheads</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={expenseAmount}
                  onChange={e => setExpenseAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Expense Details / Remarks
                </label>
                <input
                  type="text"
                  value={expenseDescription}
                  onChange={e => setExpenseDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveQuickAction(null)}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-amber-700 hover:bg-amber-800 text-white shadow-xs"
                >
                  Save Expense Voucher
                </button>
              </div>
            </form>
          )}

          {/* 7. MARK ATTENDANCE */}
          {activeQuickAction === 'mark_attendance' && (
            <form onSubmit={handleAttendanceSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Select Working Shift
                </label>
                <select
                  value={shift}
                  onChange={e => setShift(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value="Morning (8 AM - 4 PM)">Morning (8 AM - 4 PM)</option>
                  <option value="Evening (4 PM - 12 AM)">Evening (4 PM - 12 AM)</option>
                  <option value="Night (12 AM - 8 AM)">Night (12 AM - 8 AM)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Loading Labour Present
                  </label>
                  <input
                    type="number"
                    value={workerCount}
                    onChange={e => setWorkerCount(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Machine Operators
                  </label>
                  <input
                    type="number"
                    value={operatorCount}
                    onChange={e => setOperatorCount(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveQuickAction(null)}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-xs"
                >
                  Confirm Shift Muster
                </button>
              </div>
            </form>
          )}

          {/* 8. PRODUCTION ENTRY */}
          {activeQuickAction === 'production_entry' && (
            <form onSubmit={handleProductionSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={prodBatchNumber}
                    onChange={e => setProdBatchNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Feed Mill Line
                  </label>
                  <select
                    value={prodLine}
                    onChange={e => setProdLine(e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Pellet Line 1 (Main Mill)">Pellet Line 1 (Main Mill)</option>
                    <option value="Pellet Line 2 (High-Capacity)">Pellet Line 2 (High-Cap)</option>
                    <option value="Mash Mixing Unit">Mash Mixing Unit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Product Manufactured
                </label>
                <select
                  value={prodProduct}
                  onChange={e => setProdProduct(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value="Goyal Premium Cattle Feed (50kg)">Goyal Premium Cattle Feed (50kg)</option>
                  <option value="Goyal Gold Cattle Feed (50kg)">Goyal Gold Cattle Feed (50kg)</option>
                  <option value="Goyal Dairy Special (50kg)">Goyal Dairy Special (50kg)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Bags Packed & Stacked
                </label>
                <input
                  type="number"
                  value={prodBagsProduced}
                  onChange={e => setProdBagsProduced(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveQuickAction(null)}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-xs"
                >
                  Log Production Batch
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
