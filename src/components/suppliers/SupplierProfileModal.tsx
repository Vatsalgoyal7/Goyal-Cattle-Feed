import React, { useState, useMemo } from 'react';
import { FullSupplier } from '../../types';
import { useEnterprise } from '../../context/EnterpriseContext';
import { formatIndianCurrency } from '../../data/sampleData';
import { exportTableToPdf, shareViaWhatsApp } from '../../utils/exportUtils';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ShoppingCart,
  Download,
  Share2,
  Plus,
} from 'lucide-react';

interface SupplierProfileModalProps {
  supplier: FullSupplier;
  onClose: () => void;
  onEdit: (supplier: FullSupplier) => void;
}

export const SupplierProfileModal: React.FC<SupplierProfileModalProps> = ({
  supplier,
  onClose,
  onEdit,
}) => {
  const { purchases, ledgers, payments, setIsCreatePurchaseOpen, setIsRecordPaymentOpen } = useEnterprise();

  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Purchase History' | 'Bills' | 'Payments' | 'Ledger' | 'Documents' | 'Activity'
  >('Overview');

  const supplierPurchases = useMemo(() => {
    return purchases.filter(
      p => p.supplierId === supplier.id || p.supplierFirm === supplier.firmName
    );
  }, [purchases, supplier]);

  const supplierLedger = useMemo(() => {
    return ledgers.filter(
      l => l.partyId === supplier.id || l.partyName === supplier.firmName
    );
  }, [ledgers, supplier]);

  const supplierPayments = useMemo(() => {
    return payments.filter(
      p => p.partyId === supplier.id || p.partyFirm === supplier.firmName
    );
  }, [payments, supplier]);

  const handleDownloadLedger = () => {
    const cols = [
      { header: 'Date', key: 'date' },
      { header: 'Particulars', key: 'particulars' },
      { header: 'Bill/Voucher', key: 'transactionId' },
      { header: 'Paid (Dr)', key: 'debit' },
      { header: 'Purchased (Cr)', key: 'credit' },
      { header: 'Status', key: 'paymentStatus' },
    ];
    exportTableToPdf(
      `SUPPLIER KHATA STATEMENT: ${supplier.firmName.toUpperCase()}`,
      `Contact: ${supplier.name} | Phone: ${supplier.phone} | Outstanding Payable: ₹${supplier.currentPayable.toLocaleString('en-IN')}`,
      cols,
      supplierLedger,
      `Supplier_Ledger_${supplier.supplierId}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              {supplier.firmName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {supplier.firmName}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-mono">
                  {supplier.supplierId}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-4">
                <span>Contact: <strong>{supplier.name}</strong></span>
                <span>Phone: <strong className="font-mono">{supplier.phone}</strong></span>
                <span>GSTIN: <strong className="font-mono">{supplier.gstin || 'None'}</strong></span>
                <span>Products: <strong>{supplier.suppliedProducts.join(', ')}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleDownloadLedger}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Download Statement
            </button>
            <button
              onClick={() => onEdit(supplier)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 transition"
            >
              Edit
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 7 Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto text-xs font-medium scrollbar-none">
          {(['Overview', 'Purchase History', 'Bills', 'Payments', 'Ledger', 'Documents', 'Activity'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-3 border-b-2 font-semibold transition whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-700 dark:text-slate-300">
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Total Purchases</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block font-mono">
                    {formatIndianCurrency(supplier.totalPurchases)}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Payments Disbursed</span>
                  <span className="text-base font-bold text-emerald-600 mt-1 block font-mono">
                    {formatIndianCurrency(supplier.totalPayments)}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Current Payable (Due)</span>
                  <span className="text-base font-bold text-red-600 mt-1 block font-mono">
                    {formatIndianCurrency(supplier.currentPayable)}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Credit Terms</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block font-mono">
                    {supplier.creditDays} Days Net
                  </span>
                </div>
              </div>

              {/* Bank Details */}
              {supplier.bankDetails && (
                <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block text-sm">
                    Registered Bank Account for Vendor RTGS:
                  </span>
                  <p><span className="text-slate-500">Bank:</span> <strong>{supplier.bankDetails.bankName}</strong></p>
                  <p><span className="text-slate-500">Account No:</span> <strong className="font-mono">{supplier.bankDetails.accountNumber}</strong></p>
                  <p><span className="text-slate-500">IFSC Code:</span> <strong className="font-mono">{supplier.bankDetails.ifscCode}</strong> ({supplier.bankDetails.branch})</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Purchase History' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-800 block">Procurement Inflow History</span>
              <table className="w-full border border-slate-200 dark:border-slate-800 rounded">
                <thead className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <tr>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Voucher No.</th>
                    <th className="p-2 text-left">Supplier Bill</th>
                    <th className="p-2 text-right">Amount</th>
                    <th className="p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {supplierPurchases.map(p => (
                    <tr key={p.id}>
                      <td className="p-2">{p.purchaseDate}</td>
                      <td className="p-2 font-mono font-bold">{p.purchaseNumber}</td>
                      <td className="p-2 font-mono">{p.supplierInvoiceNumber}</td>
                      <td className="p-2 text-right font-mono font-bold">₹{p.grandTotal.toLocaleString('en-IN')}</td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100">{p.paymentStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'Bills' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-800 block">Vendor Invoices</span>
              <div className="space-y-2">
                {supplierPurchases.map(p => (
                  <div key={p.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between">
                    <div>
                      <strong className="font-mono">{p.supplierInvoiceNumber}</strong> (Voucher: {p.purchaseNumber})
                      <p className="text-[11px] text-slate-500">Date: {p.purchaseDate}</p>
                    </div>
                    <div className="text-right">
                      <strong className="font-mono">₹{p.grandTotal.toLocaleString('en-IN')}</strong>
                      <p className="text-[11px] text-slate-500">
                        Paid: ₹{p.amountPaid.toLocaleString('en-IN')} | Due: <span className="text-red-600">₹{p.balanceDue.toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Payments' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-800 block">Payments Disbursed</span>
              {supplierPayments.length === 0 ? (
                <p className="text-slate-400 p-4 text-center">No payment vouchers logged yet.</p>
              ) : (
                supplierPayments.map(p => (
                  <div key={p.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between">
                    <div>
                      <strong className="font-mono">{p.paymentNumber}</strong>
                      <p className="text-[11px] text-slate-500">{p.date} via {p.paymentMode}</p>
                    </div>
                    <strong className="text-blue-600 font-mono">₹{p.amount.toLocaleString('en-IN')}</strong>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'Ledger' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">Supplier Ledger (Khata)</span>
                <button onClick={handleDownloadLedger} className="px-3 py-1 rounded border text-xs font-semibold">
                  Export PDF
                </button>
              </div>
              <table className="w-full border border-slate-200 dark:border-slate-800 text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Particulars</th>
                    <th className="p-2 text-right">Debit (Paid)</th>
                    <th className="p-2 text-right">Credit (Purchased)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {supplierLedger.map(l => (
                    <tr key={l.id}>
                      <td className="p-2">{l.date}</td>
                      <td className="p-2">{l.particulars}</td>
                      <td className="p-2 text-right font-mono text-emerald-600 font-bold">
                        {l.debit > 0 ? `₹${l.debit.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="p-2 text-right font-mono text-red-600 font-bold">
                        {l.credit > 0 ? `₹${l.credit.toLocaleString('en-IN')}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'Documents' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-800 block">Vendor Verification Documents</span>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <strong>GSTIN & Trade License:</strong> {supplier.gstin || 'Submitted & Verified'}
              </div>
            </div>
          )}

          {activeTab === 'Activity' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-800 block">Vendor Activity Log</span>
              <p className="text-slate-500">Procurement deliveries active under credit terms ({supplier.creditDays} days).</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between bg-slate-50 dark:bg-slate-950/70">
          <span className="text-[11px] text-slate-500">Supplier: {supplier.supplierId}</span>
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
