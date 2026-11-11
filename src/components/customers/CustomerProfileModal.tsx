import React, { useState, useMemo } from 'react';
import { FullCustomer } from '../../types';
import { useEnterprise } from '../../context/EnterpriseContext';
import { formatIndianCurrency } from '../../data/sampleData';
import { exportTableToPdf, shareViaWhatsApp, exportToExcel } from '../../utils/exportUtils';
import {
  X,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  DollarSign,
  BookOpen,
  FileCheck,
  Clock,
  Send,
  Plus,
  Share2,
  Download,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface CustomerProfileModalProps {
  customer: FullCustomer;
  onClose: () => void;
  onEdit: (customer: FullCustomer) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  customer,
  onClose,
  onEdit,
}) => {
  const {
    invoices,
    ledgers,
    payments,
    setIsCreateInvoiceOpen,
    setIsRecordPaymentOpen,
    setPreviewInvoice,
  } = useEnterprise();

  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Sales History' | 'Invoices' | 'Payments' | 'Ledger' | 'Notes' | 'Documents' | 'Activity'
  >('Overview');

  const customerInvoices = useMemo(() => {
    return invoices.filter(
      i => i.customerId === customer.id || i.customerFirm === customer.firmName
    );
  }, [invoices, customer]);

  const customerLedger = useMemo(() => {
    return ledgers.filter(
      l => l.partyId === customer.id || l.partyName === customer.firmName
    );
  }, [ledgers, customer]);

  const customerPayments = useMemo(() => {
    return payments.filter(
      p => p.partyId === customer.id || p.partyFirm === customer.firmName
    );
  }, [payments, customer]);

  const creditUsagePercent = Math.min(
    100,
    Math.round((customer.currentOutstanding / (customer.creditLimit || 1)) * 100)
  );

  const handleDownloadLedger = () => {
    const cols = [
      { header: 'Date', key: 'date' },
      { header: 'Particulars', key: 'particulars' },
      { header: 'Voucher Ref', key: 'transactionId' },
      { header: 'Debit (Dr)', key: 'debit' },
      { header: 'Credit (Cr)', key: 'credit' },
      { header: 'Status', key: 'paymentStatus' },
    ];
    exportTableToPdf(
      `CUSTOMER KHATA STATEMENT: ${customer.firmName.toUpperCase()}`,
      `Contact: ${customer.name} | Phone: ${customer.phone} | Outstanding: ₹${customer.currentOutstanding.toLocaleString('en-IN')}`,
      cols,
      customerLedger,
      `Ledger_${customer.customerId}`
    );
  };

  const handleWhatsAppReminder = () => {
    const msg = `Namaste ${customer.name} Ji,\nThis is a friendly statement from *Goyal Cattle Feed Pvt. Ltd.*:\nYour current ledger outstanding is *₹${customer.currentOutstanding.toLocaleString('en-IN')}* against approved credit limit of ₹${customer.creditLimit.toLocaleString('en-IN')}.\nKindly clear the pending bills at your earliest convenience via RTGS/NEFT to our HDFC Account (A/C: 50200084920193).\nThank you!`;
    shareViaWhatsApp(customer.phone, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Profile Banner */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              {customer.firmName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {customer.firmName}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold">
                  {customer.category}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {customer.customerId}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-4">
                <span>Contact: <strong className="text-slate-800 dark:text-slate-200">{customer.name}</strong></span>
                <span>Phone: <strong className="text-slate-800 dark:text-slate-200 font-mono">{customer.phone}</strong></span>
                <span>GST: <strong className="font-mono text-slate-800 dark:text-slate-200">{customer.gstin || 'Unregistered'}</strong></span>
                <span>Location: <strong className="text-slate-800 dark:text-slate-200">{customer.city}, {customer.state}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleWhatsAppReminder}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <button
              onClick={handleDownloadLedger}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Statement
            </button>
            <button
              onClick={() => onEdit(customer)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Edit Details
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 8 Tab Navigation Bar */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto text-xs font-medium scrollbar-none">
          {(['Overview', 'Sales History', 'Invoices', 'Payments', 'Ledger', 'Notes', 'Documents', 'Activity'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-3 border-b-2 font-semibold transition whitespace-nowrap ${
                activeTab === tab
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-700 dark:text-slate-300">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Total Lifetime Sales</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block font-mono">
                    {formatIndianCurrency(customer.totalSales)}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Total Payments Received</span>
                  <span className="text-base font-bold text-emerald-600 mt-1 block font-mono">
                    {formatIndianCurrency(customer.totalPayments)}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Current Outstanding</span>
                  <span className="text-base font-bold text-red-600 mt-1 block font-mono">
                    {formatIndianCurrency(customer.currentOutstanding)}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Credit Limit</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block font-mono">
                    {formatIndianCurrency(customer.creditLimit)}
                  </span>
                </div>
              </div>

              {/* Credit Limit Gauge Bar */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Credit Limit Utilization</span>
                  <span className={creditUsagePercent > 80 ? 'text-red-600' : 'text-emerald-600'}>
                    {creditUsagePercent}% Used
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      creditUsagePercent > 85 ? 'bg-red-500' : creditUsagePercent > 65 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${creditUsagePercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Outstanding: ₹{customer.currentOutstanding.toLocaleString('en-IN')}</span>
                  <span>Available Credit: ₹{Math.max(0, customer.creditLimit - customer.currentOutstanding).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Addresses and Contact info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Billing Details</span>
                  <p><strong className="text-slate-600">Firm:</strong> {customer.firmName}</p>
                  <p><strong className="text-slate-600">Address:</strong> {customer.billingAddress}</p>
                  <p><strong className="text-slate-600">City / State:</strong> {customer.city}, {customer.state} ({customer.stateCode})</p>
                  <p><strong className="text-slate-600">GSTIN:</strong> {customer.gstin || 'None'}</p>
                  <p><strong className="text-slate-600">PAN:</strong> {customer.pan || 'None'}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Trading Terms</span>
                  <p><strong className="text-slate-600">Customer Category:</strong> {customer.category}</p>
                  <p><strong className="text-slate-600">Last Purchase Date:</strong> {customer.lastPurchaseDate}</p>
                  <p><strong className="text-slate-600">Opening Balance:</strong> ₹{customer.openingBalance.toLocaleString('en-IN')}</p>
                  <p><strong className="text-slate-600">Account Status:</strong> <span className="text-emerald-600 font-bold">Active</span></p>
                  {customer.notes && <p><strong className="text-slate-600">Special Notes:</strong> {customer.notes}</p>}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SALES HISTORY */}
          {activeTab === 'Sales History' && (
            <div className="space-y-4">
              <span className="font-bold text-slate-800 block text-sm">Dispatched Orders & Bills</span>
              <table className="w-full border border-slate-200 dark:border-slate-800 rounded">
                <thead className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <tr>
                    <th className="p-2.5 text-left">Date</th>
                    <th className="p-2.5 text-left">Bill No.</th>
                    <th className="p-2.5 text-left">Doc Type</th>
                    <th className="p-2.5 text-right">Amount</th>
                    <th className="p-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {customerInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5">{inv.invoiceDate}</td>
                      <td className="p-2.5 font-mono font-bold">{inv.invoiceNumber}</td>
                      <td className="p-2.5">{inv.documentType}</td>
                      <td className="p-2.5 text-right font-bold font-mono">₹{inv.grandTotal.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-center">
                        <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-slate-100 text-slate-800">
                          {inv.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: INVOICES */}
          {activeTab === 'Invoices' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">Invoices & Receivables</span>
                <button
                  onClick={() => setIsCreateInvoiceOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs"
                >
                  + Create Invoice
                </button>
              </div>

              <div className="space-y-2">
                {customerInvoices.map(inv => (
                  <div
                    key={inv.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white block">
                        {inv.invoiceNumber} ({inv.documentType})
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Date: {inv.invoiceDate} | Due: {inv.dueDate}
                      </p>
                    </div>

                    <div className="text-right space-y-0.5">
                      <span className="font-mono font-bold text-sm block">
                        ₹{inv.grandTotal.toLocaleString('en-IN')}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Paid: ₹{inv.amountPaid.toLocaleString('en-IN')} | Due: <strong className="text-red-600">₹{inv.balanceDue.toLocaleString('en-IN')}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => setPreviewInvoice(inv)}
                      className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENTS */}
          {activeTab === 'Payments' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">Payment Collection History</span>
                <button
                  onClick={() => setIsRecordPaymentOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs"
                >
                  + Record Receipt
                </button>
              </div>

              {customerPayments.length === 0 ? (
                <p className="p-4 text-center text-slate-400">No payment receipts logged yet.</p>
              ) : (
                customerPayments.map(p => (
                  <div
                    key={p.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold block">{p.paymentNumber}</span>
                      <p className="text-[11px] text-slate-500">
                        {p.date} via {p.paymentMode} | Ref: {p.transactionRef || 'N/A'}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 font-mono">
                      +₹{p.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: LEDGER */}
          {activeTab === 'Ledger' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">Customer Khata Account Ledger</span>
                <button
                  onClick={handleDownloadLedger}
                  className="px-3 py-1 rounded border border-slate-300 text-xs font-semibold"
                >
                  Download Statement (PDF)
                </button>
              </div>

              <table className="w-full border border-slate-200 dark:border-slate-800 text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <tr>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Particulars</th>
                    <th className="p-2 text-right">Debit (Dr)</th>
                    <th className="p-2 text-right">Credit (Cr)</th>
                    <th className="p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {customerLedger.map(l => (
                    <tr key={l.id}>
                      <td className="p-2">{l.date}</td>
                      <td className="p-2">{l.particulars}</td>
                      <td className="p-2 text-right font-mono font-bold text-red-600">
                        {l.debit > 0 ? `₹${l.debit.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-emerald-600">
                        {l.credit > 0 ? `₹${l.credit.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800">
                          {l.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 6: NOTES */}
          {activeTab === 'Notes' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-800 block">Internal Relationship Notes</span>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {customer.notes || 'No special notes logged for this dealer yet.'}
                </p>
                <div className="pt-2 text-[11px] text-slate-400">
                  Logged by: Senior Sales Manager | Goyal Cattle Feed
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DOCUMENTS */}
          {activeTab === 'Documents' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-800 block">Verified Compliance Documents</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="block">GST Registration Certificate</strong>
                    <span className="text-slate-500 text-[11px] font-mono">{customer.gstin || 'Not submitted'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-emerald-700 bg-emerald-100 text-[10px] font-bold">
                    Verified
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="block">Dealer Sole Proprietary Deed / PAN</strong>
                    <span className="text-slate-500 text-[11px] font-mono">{customer.pan || 'PAN Verified'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-emerald-700 bg-emerald-100 text-[10px] font-bold">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ACTIVITY */}
          {activeTab === 'Activity' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-800 block">Audit & Interaction Timeline</span>
              <div className="border-l-2 border-emerald-500 pl-4 space-y-3">
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-white">Sales Invoice Generated</span>
                  <p className="text-[11px] text-slate-500">Recent feed dispatch logged. Last purchase: {customer.lastPurchaseDate}</p>
                </div>
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-white">Credit Limit Review</span>
                  <p className="text-[11px] text-slate-500">Limit capped at ₹{customer.creditLimit.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <span className="text-slate-500 text-[11px]">
            Dealer ID: {customer.customerId} | Goyal Business OS
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
