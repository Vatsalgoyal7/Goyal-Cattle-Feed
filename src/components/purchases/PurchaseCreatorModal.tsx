import React, { useState } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { useApp } from '../../context/AppContext';
import {
  PurchaseInvoice,
  PurchaseInvoiceItem,
  PaymentMode,
  ProductUnit,
} from '../../types';
import {
  X,
  Plus,
  Trash2,
  ShoppingCart,
  Building,
  Calendar,
  CreditCard,
  AlertCircle,
  Truck,
} from 'lucide-react';

interface PurchaseCreatorModalProps {
  onClose: () => void;
}

const RAW_MATERIAL_PRESETS = [
  { name: 'Yellow Maize (Moisture < 12%)', hsn: '10059000', rate: 2150, unit: 'Quintal' },
  { name: 'Soybean Meal / DOC (Protein 46%)', hsn: '23040010', rate: 4200, unit: 'Quintal' },
  { name: 'Mustard De-oiled Cake (DOC)', hsn: '23064900', rate: 2450, unit: 'Quintal' },
  { name: 'De-oiled Rice Bran (DORB)', hsn: '23024000', rate: 1650, unit: 'Quintal' },
  { name: 'Cattle Feed Mineral Premix & Vitamins', hsn: '23099090', rate: 85, unit: 'KG' },
  { name: 'HDPE Woven Feed Bags (50kg capacity)', hsn: '63053300', rate: 22, unit: 'Piece' },
];

export const PurchaseCreatorModal: React.FC<PurchaseCreatorModalProps> = ({ onClose }) => {
  const { suppliers, createPurchase } = useEnterprise();
  const { userProfile } = useApp();

  const [documentType, setDocumentType] = useState<'Purchase Bill' | 'Purchase Order' | 'Purchase Return' | 'Debit Note'>('Purchase Bill');
  const [purchaseNumber, setPurchaseNumber] = useState(`PUR/2026/${Math.floor(1000 + Math.random() * 9000)}`);
  const [supplierInvoiceNumber, setSupplierInvoiceNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 15 * 86400000).toLocaleDateString('en-GB'));

  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierFirm, setSupplierFirm] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierGstin, setSupplierGstin] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');
  const [supplierState, setSupplierState] = useState('Punjab');
  const [referenceNumber, setReferenceNumber] = useState('');

  const [items, setItems] = useState<PurchaseInvoiceItem[]>([
    {
      id: 'pur-it-1',
      productName: 'Yellow Maize (Moisture < 12%)',
      hsn: '10059000',
      quantity: 100,
      unit: 'Quintal',
      purchaseRate: 2150,
      discountPercent: 0,
      taxableValue: 215000,
      gstRate: 0,
      gstAmount: 0,
      totalAmount: 215000,
    },
  ]);

  const [freightCharges, setFreightCharges] = useState<number>(3500);
  const [loadingCharges, setLoadingCharges] = useState<number>(1200);
  const [otherCharges, setOtherCharges] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Bank Transfer');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSelectSupplier = (id: string) => {
    setSelectedSupplierId(id);
    const supp = suppliers.find(s => s.id === id);
    if (supp) {
      setSupplierName(supp.name);
      setSupplierFirm(supp.firmName);
      setSupplierPhone(supp.phone);
      setSupplierGstin(supp.gstin || '');
      setSupplierAddress(`${supp.address}, ${supp.city}`);
      setSupplierState(supp.state);
    }
  };

  const handleItemChange = (index: number, field: keyof PurchaseInvoiceItem, val: any) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };

      const qty = Number(copy[index].quantity) || 0;
      const rate = Number(copy[index].purchaseRate) || 0;
      const gross = qty * rate;
      const disc = (gross * (Number(copy[index].discountPercent) || 0)) / 100;
      const taxable = gross - disc;
      const tax = (taxable * (Number(copy[index].gstRate) || 0)) / 100;

      copy[index].taxableValue = taxable;
      copy[index].gstAmount = tax;
      copy[index].totalAmount = taxable + tax;

      return copy;
    });
  };

  const handleAddPresetItem = (preset: typeof RAW_MATERIAL_PRESETS[0]) => {
    const newItem: PurchaseInvoiceItem = {
      id: `it-${Date.now()}`,
      productName: preset.name,
      hsn: preset.hsn,
      quantity: 50,
      unit: preset.unit,
      purchaseRate: preset.rate,
      discountPercent: 0,
      taxableValue: 50 * preset.rate,
      gstRate: preset.name.includes('Bags') ? 12 : preset.name.includes('Premix') ? 18 : 0,
      gstAmount: 0,
      totalAmount: 50 * preset.rate,
    };
    newItem.gstAmount = (newItem.taxableValue * newItem.gstRate) / 100;
    newItem.totalAmount = newItem.taxableValue + newItem.gstAmount;
    setItems(prev => [...prev, newItem]);
  };

  // Aggregates
  const subtotal = items.reduce((acc, it) => acc + it.taxableValue, 0);
  const totalTax = items.reduce((acc, it) => acc + it.gstAmount, 0);
  const addCharges = (freightCharges || 0) + (loadingCharges || 0) + (otherCharges || 0);
  const grandTotal = Math.round(subtotal + totalTax + addCharges);
  const balanceDue = Math.max(0, grandTotal - (amountPaid || 0));

  const handleSave = () => {
    if (!supplierFirm && !supplierName) {
      setError('Please select or specify a Supplier Name / Firm');
      return;
    }
    if (!supplierInvoiceNumber) {
      setError('Supplier Invoice / Bill No is required');
      return;
    }
    if (items.length === 0) {
      setError('At least one item row is required');
      return;
    }

    const newPurchase: Omit<PurchaseInvoice, 'id'> = {
      purchaseNumber,
      supplierInvoiceNumber,
      documentType,
      purchaseDate,
      dueDate,
      supplierId: selectedSupplierId || `supp-manual-${Date.now()}`,
      supplierName: supplierName || supplierFirm,
      supplierFirm: supplierFirm || supplierName,
      supplierPhone,
      supplierGstin,
      supplierAddress,
      supplierState,
      referenceNumber,
      items,
      freightCharges: freightCharges || 0,
      loadingCharges: loadingCharges || 0,
      otherCharges: otherCharges || 0,
      subtotal,
      totalTax,
      roundOff: 0,
      grandTotal,
      amountPaid: amountPaid || 0,
      balanceDue,
      paymentMode,
      paymentStatus: balanceDue === 0 ? 'Paid' : amountPaid > 0 ? 'Partially Paid' : 'Unpaid',
      transactionRef,
      notes,
      createdBy: userProfile?.fullName || 'Purchase Dept',
      createdAt: new Date().toISOString(),
    };

    createPurchase(newPurchase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400">
              <ShoppingCart className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Record Raw Material Purchase / PO
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Goyal Cattle Feed Pvt. Ltd. | Procurement & Mandi Grain Inflow
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="px-6 py-2 bg-red-50 text-red-700 text-xs flex items-center gap-2 border-b border-red-200">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Row 1: Bill type & supplier bill */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold mb-1">Document Type *</label>
              <select
                value={documentType}
                onChange={e => setDocumentType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
              >
                <option value="Purchase Bill">Purchase Bill</option>
                <option value="Purchase Order">Purchase Order</option>
                <option value="Debit Note">Debit Note</option>
                <option value="Purchase Return">Purchase Return</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Purchase Voucher No *</label>
              <input
                type="text"
                value={purchaseNumber}
                onChange={e => setPurchaseNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Supplier Bill / Invoice No *</label>
              <input
                type="text"
                value={supplierInvoiceNumber}
                onChange={e => setSupplierInvoiceNumber(e.target.value)}
                placeholder="e.g. AGRO/8812"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Purchase Date *</label>
              <input
                type="text"
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          {/* Supplier Info */}
          <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-500 text-[11px]">
                Supplier & Miller Details
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Pick Registered Vendor:</span>
                <select
                  value={selectedSupplierId}
                  onChange={e => handleSelectSupplier(e.target.value)}
                  className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                >
                  <option value="">-- Choose Supplier --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firmName} ({s.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Supplier Firm *</label>
                <input
                  type="text"
                  value={supplierFirm}
                  onChange={e => setSupplierFirm(e.target.value)}
                  placeholder="e.g. Punjab Agro Industries"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Contact Person</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={e => setSupplierName(e.target.value)}
                  placeholder="e.g. Harnek Singh"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Supplier GSTIN</label>
                <input
                  type="text"
                  value={supplierGstin}
                  onChange={e => setSupplierGstin(e.target.value.toUpperCase())}
                  placeholder="03AAACG8899F1Z2"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* Quick Raw Material Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-500 font-semibold block">Quick Add Raw Materials:</span>
            <div className="flex flex-wrap gap-1.5">
              {RAW_MATERIAL_PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddPresetItem(p)}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition"
                >
                  + {p.name.split('(')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                <tr>
                  <th className="p-2 w-8 text-center">#</th>
                  <th className="p-2">Item Description</th>
                  <th className="p-2 w-20">HSN</th>
                  <th className="p-2 w-20 text-center">Qty</th>
                  <th className="p-2 w-20 text-center">Unit</th>
                  <th className="p-2 w-24 text-right">Rate (₹)</th>
                  <th className="p-2 w-16 text-center">GST %</th>
                  <th className="p-2 w-28 text-right">Total (₹)</th>
                  <th className="p-2 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {items.map((it, idx) => (
                  <tr key={it.id}>
                    <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={it.productName}
                        onChange={e => handleItemChange(idx, 'productName', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={it.hsn}
                        onChange={e => handleItemChange(idx, 'hsn', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-center"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={it.quantity || ''}
                        onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))}
                        className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-center font-bold"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={it.unit}
                        onChange={e => handleItemChange(idx, 'unit', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-center"
                      >
                        <option value="Quintal">Quintal</option>
                        <option value="Ton">Ton</option>
                        <option value="Bag">Bag</option>
                        <option value="KG">KG</option>
                        <option value="Piece">Piece</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={it.purchaseRate || ''}
                        onChange={e => handleItemChange(idx, 'purchaseRate', Number(e.target.value))}
                        className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-right font-medium"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={it.gstRate}
                        onChange={e => handleItemChange(idx, 'gstRate', Number(e.target.value))}
                        className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-center"
                      >
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                      </select>
                    </td>
                    <td className="p-2 text-right font-bold font-mono">
                      ₹{it.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => setItems(items.filter((_, i) => i !== idx))}
                        disabled={items.length <= 1}
                        className="text-slate-400 hover:text-red-500 disabled:opacity-30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Additional Charges & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-[11px] text-slate-600 block">Freight & Mandi Charges</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500">Freight Charges (₹)</label>
                  <input
                    type="number"
                    value={freightCharges || ''}
                    onChange={e => setFreightCharges(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">Loading/Labour (₹)</label>
                  <input
                    type="number"
                    value={loadingCharges || ''}
                    onChange={e => setLoadingCharges(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-[11px] text-slate-600 block">Payment Settlement</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value as PaymentMode)}
                    className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="Bank Transfer">Bank Transfer (RTGS)</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">Amount Paid (₹)</label>
                  <input
                    type="number"
                    value={amountPaid || ''}
                    onChange={e => setAmountPaid(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grand Totals Box */}
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-slate-600 dark:text-slate-400">
                Taxable: <strong>₹{subtotal.toLocaleString('en-IN')}</strong> | Tax: <strong>₹{totalTax.toLocaleString('en-IN')}</strong> | Charges: <strong>₹{addCharges.toLocaleString('en-IN')}</strong>
              </p>
              <p className="text-slate-500 text-[10px]">
                Balance Due to Vendor: <strong className="text-red-600 font-mono">₹{balanceDue.toLocaleString('en-IN')}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Net Purchase Bill Total:</span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-medium"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
          >
            Record Purchase Bill
          </button>
        </div>

      </div>
    </div>
  );
};
