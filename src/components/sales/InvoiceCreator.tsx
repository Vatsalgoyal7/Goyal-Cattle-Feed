import React, { useState, useMemo } from 'react';
import {
  DocumentType,
  PaymentMode,
  ProductUnit,
  SalesInvoiceItem,
  AdditionalCharges,
  SalesInvoice,
  InvoicePaymentStatus,
} from '../../types';
import { useEnterprise } from '../../context/EnterpriseContext';
import { useApp } from '../../context/AppContext';
import { calculateInvoice, validateInvoice } from '../../utils/billingCalculations';
import {
  X,
  Plus,
  Trash2,
  FileCheck,
  Building,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Percent,
  Truck,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface InvoiceCreatorProps {
  onClose: () => void;
  onSuccess?: (invoice: SalesInvoice) => void;
}

const DOCUMENT_TYPES: DocumentType[] = [
  'GST Tax Invoice',
  'Non-GST Invoice',
  'Retail Cash Memo',
  'Sales Order',
  'Estimate',
  'Proforma Invoice',
  'Delivery Challan',
  'Payment Receipt',
  'Credit Note',
  'Debit Note',
];

const PAYMENT_MODES: PaymentMode[] = ['Bank Transfer', 'UPI', 'Cash', 'Cheque', 'Other'];
const UNITS: ProductUnit[] = ['Bag', 'KG', 'Quintal', 'Ton', 'Piece'];
const GST_RATES = [0, 5, 12, 18, 28];

export const InvoiceCreator: React.FC<InvoiceCreatorProps> = ({ onClose, onSuccess }) => {
  const { customers, createSalesInvoice, setPreviewInvoice } = useEnterprise();
  const { userProfile, products } = useApp();

  // Basic Details
  const defaultNumber = `INV/2026/${Math.floor(1000 + Math.random() * 9000)}`;
  const todayStr = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY
  const dueDefault = new Date(Date.now() + 15 * 86400000).toLocaleDateString('en-GB');

  const [documentType, setDocumentType] = useState<DocumentType>('GST Tax Invoice');
  const [invoiceNumber, setInvoiceNumber] = useState(defaultNumber);
  const [invoiceDate, setInvoiceDate] = useState(todayStr);
  const [dueDate, setDueDate] = useState(dueDefault);
  const [paymentTerms, setPaymentTerms] = useState('15 Days Credit');
  const [referenceNumber, setReferenceNumber] = useState('');

  // Customer state
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerFirm, setCustomerFirm] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [state, setState] = useState('Punjab');
  const [stateCode, setStateCode] = useState('03');
  const [placeOfSupply, setPlaceOfSupply] = useState('Punjab (03)');

  // Items state
  const [items, setItems] = useState<SalesInvoiceItem[]>([
    {
      id: 'item-1',
      productName: 'Goyal Premium Balanced Feed (50kg Bag)',
      sku: 'GPF-50KG',
      hsn: '23099010',
      quantity: 100,
      unit: 'Bag',
      rate: 1650,
      discountPercent: 0,
      discountAmount: 0,
      taxableValue: 165000,
      gstRate: 5,
      cgstAmount: 4125,
      sgstAmount: 4125,
      igstAmount: 0,
      totalAmount: 173250,
    },
  ]);

  // Additional charges
  const [charges, setCharges] = useState<AdditionalCharges>({
    transport: 1500,
    loading: 500,
    unloading: 0,
    packaging: 0,
    other: 0,
    discount: 0,
    roundOff: 0,
  });

  // Payment
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Bank Transfer');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Inter-state check (Punjab is 03)
  const isInterState = stateCode !== '03';

  // Live calculations
  const calculation = useMemo(() => {
    return calculateInvoice(items, charges, isInterState, amountPaid);
  }, [items, charges, isInterState, amountPaid]);

  // Handle Customer Selection
  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const found = customers.find(c => c.id === customerId);
    if (found) {
      setCustomerName(found.name);
      setCustomerFirm(found.firmName);
      setCustomerPhone(found.phone);
      setCustomerGstin(found.gstin || '');
      setBillingAddress(found.billingAddress);
      setShippingAddress(found.shippingAddress || found.billingAddress);
      setState(found.state);
      setStateCode(found.stateCode);
      setPlaceOfSupply(`${found.state} (${found.stateCode})`);
    }
  };

  // Item modifications
  const handleItemChange = (index: number, field: keyof SalesInvoiceItem, value: any) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleQuickProductPick = (index: number, prodId: string) => {
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setItems(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          hsn: prod.hsnCode || '23099010',
          rate: prod.ratePerUnit,
          unit: 'Bag',
        };
        return updated;
      });
    }
  };

  const handleAddItem = () => {
    const newItem: SalesInvoiceItem = {
      id: `item-${Date.now()}`,
      productName: '',
      sku: 'FEED-GEN',
      hsn: '23099010',
      quantity: 1,
      unit: 'Bag',
      rate: 1600,
      discountPercent: 0,
      discountAmount: 0,
      taxableValue: 1600,
      gstRate: 5,
      cgstAmount: 40,
      sgstAmount: 40,
      igstAmount: 0,
      totalAmount: 1680,
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = (status: InvoicePaymentStatus = 'Pending Payment', previewAfter: boolean = false) => {
    const issues = validateInvoice(
      customerFirm || customerName,
      customerPhone,
      customerGstin,
      items,
      invoiceDate,
      dueDate
    );

    if (issues.length > 0) {
      setValidationErrors(issues.map(i => i.message));
      return;
    }

    setValidationErrors([]);

    const computedStatus: InvoicePaymentStatus =
      status === 'Draft'
        ? 'Draft'
        : calculation.balanceDue === 0
        ? 'Completed'
        : (Number(amountPaid) || 0) > 0
        ? 'Partially Paid'
        : 'Pending Payment';

    const newInvoice: Omit<SalesInvoice, 'id'> = {
      invoiceNumber,
      documentType,
      invoiceDate,
      dueDate,
      customerId: selectedCustomerId || `cust-manual-${Date.now()}`,
      customerName: customerName || customerFirm,
      customerFirm: customerFirm || customerName,
      customerPhone,
      customerGstin,
      billingAddress,
      shippingAddress: shippingAddress || billingAddress,
      state,
      stateCode,
      placeOfSupply,
      paymentTerms,
      referenceNumber,
      isInterState,
      items: calculation.items,
      additionalCharges: charges,
      subtotal: calculation.subtotal,
      totalDiscount: calculation.totalDiscount,
      taxableAmount: calculation.taxableAmount,
      cgstTotal: calculation.cgstTotal,
      sgstTotal: calculation.sgstTotal,
      igstTotal: calculation.igstTotal,
      additionalChargesTotal: calculation.additionalChargesTotal,
      roundOff: calculation.roundOff,
      grandTotal: calculation.grandTotal,
      amountPaid: Number(amountPaid) || 0,
      balanceDue: calculation.balanceDue,
      paymentMode,
      paymentStatus: computedStatus,
      transactionRef,
      notes,
      createdBy: userProfile?.fullName || 'Rajesh Goyal',
      createdAt: new Date().toISOString(),
    };

    const saved = createSalesInvoice(newInvoice);

    if (previewAfter) {
      setPreviewInvoice(saved);
    }

    if (onSuccess) {
      onSuccess(saved);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
              <FileCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Create Billing Document
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Goyal Cattle Feed Pvt. Ltd. | 10 Supported Tax & Commercial Formats
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Validation Errors Notice */}
        {validationErrors.length > 0 && (
          <div className="px-6 py-3 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900/50 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Please fix the following validation errors:</span>
              <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Form Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Section 1: Document Config */}
          <div className="bg-slate-50/70 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>Section 1: Document Type & Numbering</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Document Type *
                </label>
                <select
                  value={documentType}
                  onChange={e => setDocumentType(e.target.value as DocumentType)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  {DOCUMENT_TYPES.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Document Number *
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={e => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Invoice Date *
                </label>
                <input
                  type="text"
                  value={invoiceDate}
                  onChange={e => setInvoiceDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Payment Due Date
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={e => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="Immediate Cash">Immediate Cash</option>
                  <option value="7 Days Credit">7 Days Credit</option>
                  <option value="15 Days Credit">15 Days Credit</option>
                  <option value="30 Days Credit">30 Days Credit</option>
                  <option value="Advance Received">Advance Received</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Purchase Order / Ref No.
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={e => setReferenceNumber(e.target.value)}
                  placeholder="e.g. PO-7781"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Place of Supply
                </label>
                <input
                  type="text"
                  value={placeOfSupply}
                  onChange={e => setPlaceOfSupply(e.target.value)}
                  placeholder="e.g. Punjab (03)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Customer Selection & Details */}
          <div className="bg-slate-50/70 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Section 2: Customer / Dealer Information
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Pick Existing Dealer:</span>
                <select
                  value={selectedCustomerId}
                  onChange={e => handleSelectCustomer(e.target.value)}
                  className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-medium"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.firmName} ({c.name} - {c.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Firm / Trade Name *
                </label>
                <input
                  type="text"
                  value={customerFirm}
                  onChange={e => setCustomerFirm(e.target.value)}
                  placeholder="e.g. Kisan Agro Traders"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Contact Person *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Gurpreet Singh"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Mobile Phone *
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+91 98141 87654"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Customer GSTIN
                </label>
                <input
                  type="text"
                  value={customerGstin}
                  onChange={e => setCustomerGstin(e.target.value.toUpperCase())}
                  placeholder="03AAACG1234F1Z8"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  State & Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="Punjab"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={stateCode}
                    onChange={e => setStateCode(e.target.value)}
                    placeholder="03"
                    className="w-16 px-2 py-2 text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Billing Address
                </label>
                <input
                  type="text"
                  value={billingAddress}
                  onChange={e => setBillingAddress(e.target.value)}
                  placeholder="Shop No. 12, Main Grain Market, Ludhiana"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span
                className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                  isInterState
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}
              >
                {isInterState
                  ? `Inter-State Supply (IGST Applicable) [Destination: ${state} ${stateCode}]`
                  : 'Intra-State Supply (CGST 50% + SGST 50% Applicable) [Punjab 03]'}
              </span>
            </div>
          </div>

          {/* Section 3: Dynamic Product Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Section 3: Product Items & Cattle Feed Specifications
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item Row
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-2.5 w-8 text-center">#</th>
                    <th className="p-2.5 min-w-[200px]">Product Description</th>
                    <th className="p-2.5 w-24">HSN</th>
                    <th className="p-2.5 w-20 text-center">Qty</th>
                    <th className="p-2.5 w-24 text-center">Unit</th>
                    <th className="p-2.5 w-24 text-right">Rate (₹)</th>
                    <th className="p-2.5 w-20 text-center">Disc %</th>
                    <th className="p-2.5 w-24 text-center">GST %</th>
                    <th className="p-2.5 w-28 text-right">Total (₹)</th>
                    <th className="p-2.5 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {items.map((item, idx) => {
                    const rowCalculated = calculation.items[idx];
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                        <td className="p-2">
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={item.productName}
                              onChange={e => handleItemChange(idx, 'productName', e.target.value)}
                              placeholder="e.g. Goyal Premium Feed (50kg)"
                              className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium"
                            />
                            {/* Catalog quick pick */}
                            <select
                              onChange={e => handleQuickProductPick(idx, e.target.value)}
                              className="w-full text-[10px] text-slate-500 bg-transparent border-none p-0 focus:ring-0"
                            >
                              <option value="">Quick fill from catalog...</option>
                              {products.map(p => (
                                <option key={p.id} value={p.id}>
                                  {p.name} - ₹{p.ratePerUnit}/{p.unit}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        <td className="p-2">
                          <input
                            type="text"
                            value={item.hsn}
                            onChange={e => handleItemChange(idx, 'hsn', e.target.value)}
                            className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-center"
                          />
                        </td>

                        <td className="p-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity || ''}
                            onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))}
                            className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-center font-bold"
                          />
                        </td>

                        <td className="p-2">
                          <select
                            value={item.unit}
                            onChange={e => handleItemChange(idx, 'unit', e.target.value as ProductUnit)}
                            className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-center"
                          >
                            {UNITS.map(u => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.rate || ''}
                            onChange={e => handleItemChange(idx, 'rate', Number(e.target.value))}
                            className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-right font-medium"
                          />
                        </td>

                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.discountPercent || ''}
                            onChange={e => handleItemChange(idx, 'discountPercent', Number(e.target.value))}
                            placeholder="0"
                            className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-center"
                          />
                        </td>

                        <td className="p-2">
                          <select
                            value={item.gstRate}
                            onChange={e => handleItemChange(idx, 'gstRate', Number(e.target.value))}
                            className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-center font-medium"
                          >
                            {GST_RATES.map(r => (
                              <option key={r} value={r}>
                                {r}%
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-2 text-right font-bold text-slate-900 dark:text-white">
                          ₹{rowCalculated ? rowCalculated.totalAmount.toLocaleString('en-IN') : '0'}
                        </td>

                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            disabled={items.length <= 1}
                            className="p-1 rounded text-slate-400 hover:text-red-500 disabled:opacity-30 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4 & 5: Additional Charges & Payment in 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Additional Charges */}
            <div className="bg-slate-50/70 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Additional Charges & Freight
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Transport Freight (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={charges.transport || ''}
                    onChange={e => setCharges(c => ({ ...c, transport: Number(e.target.value) }))}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Loading & Labour (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={charges.loading || ''}
                    onChange={e => setCharges(c => ({ ...c, loading: Number(e.target.value) }))}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Packaging / Bags (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={charges.packaging || ''}
                    onChange={e => setCharges(c => ({ ...c, packaging: Number(e.target.value) }))}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Special Cash Discount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={charges.discount || ''}
                    onChange={e => setCharges(c => ({ ...c, discount: Number(e.target.value) }))}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Internal Notes / Remarks
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Dispatched via Truck PB-10-CZ-8821 with Gate Pass #402"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            {/* Payment & Settlement */}
            <div className="bg-slate-50/70 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Payment Collection & Mode
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value as PaymentMode)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    {PAYMENT_MODES.map(m => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Amount Received Now (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={calculation.grandTotal}
                    value={amountPaid || ''}
                    onChange={e => setAmountPaid(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Bank UTR / Cheque No. / Transaction Ref
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={e => setTransactionRef(e.target.value)}
                  placeholder="e.g. UTR-HDFC-99182019"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between font-bold text-xs">
                  <span>Calculated Balance Due:</span>
                  <span className={calculation.balanceDue > 0 ? 'text-red-600 font-mono' : 'text-emerald-600 font-mono'}>
                    ₹{calculation.balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  {calculation.balanceDue > 0
                    ? `Will be added to customer Khata outstanding under payment terms (${paymentTerms}).`
                    : 'Bill will be marked as fully settled and Completed.'}
                </p>
              </div>
            </div>

          </div>

          {/* Section 6: Comprehensive Calculation Summary */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 p-4 rounded-xl space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Subtotal (Gross):</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  ₹{calculation.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Total Item Discounts:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
                  -₹{calculation.totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Taxable Amount:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  ₹{calculation.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                  {isInterState ? 'IGST Total:' : 'CGST + SGST Total:'}
                </span>
                <span className="font-bold text-emerald-800 dark:text-emerald-400 font-mono">
                  +₹{calculation.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200/80 dark:border-emerald-900/60 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                  Amount in Words:
                </span>
                <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 italic">
                  {calculation.amountInWords}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Grand Total:</span>
                <span className="text-xl font-extrabold text-slate-950 dark:text-white font-mono">
                  ₹{calculation.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave('Draft')}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => handleSave('Pending Payment', true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium transition shadow-xs"
            >
              <Eye className="w-4 h-4" />
              Generate & Preview
            </button>

            <button
              type="button"
              onClick={() => handleSave('Pending Payment', false)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition shadow-md"
            >
              <FileCheck className="w-4 h-4" />
              Save & Issue Invoice
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
