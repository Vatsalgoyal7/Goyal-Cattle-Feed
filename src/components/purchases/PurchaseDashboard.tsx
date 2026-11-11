import React, { useState, useMemo } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { PurchaseInvoice } from '../../types';
import { PurchaseCreatorModal } from './PurchaseCreatorModal';
import { exportToExcel, exportToCsv } from '../../utils/exportUtils';
import { formatIndianCurrency } from '../../data/sampleData';
import {
  ShoppingCart,
  Plus,
  Search,
  Download,
  FileSpreadsheet,
  FileText,
  Building,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  X,
  CreditCard,
  Layers,
} from 'lucide-react';

export const PurchaseDashboard: React.FC = () => {
  const {
    purchases,
    updatePurchaseStatus,
    isCreatePurchaseOpen,
    setIsCreatePurchaseOpen,
  } = useEnterprise();

  const [activeTab, setActiveTab] = useState<'All' | 'Paid' | 'Unpaid' | 'Partially Paid'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingPurchase, setViewingPurchase] = useState<PurchaseInvoice | null>(null);

  // Summary Metrics
  const metrics = useMemo(() => {
    let todayPurchases = 0;
    let monthlyPurchases = 0;
    let totalPurchases = 0;
    let pendingPayments = 0;

    purchases.forEach(p => {
      totalPurchases += p.grandTotal;
      monthlyPurchases += p.grandTotal;
      if (p.purchaseDate.includes('11/11/2026')) {
        todayPurchases += p.grandTotal;
      }
      pendingPayments += p.balanceDue;
    });

    return {
      todayPurchases,
      monthlyPurchases,
      totalPurchases,
      totalBills: purchases.length,
      pendingPayments,
    };
  }, [purchases]);

  const filteredPurchases = useMemo(() => {
    return purchases.filter(p => {
      const matchesTab = activeTab === 'All' || p.paymentStatus === activeTab;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        p.purchaseNumber.toLowerCase().includes(term) ||
        p.supplierInvoiceNumber.toLowerCase().includes(term) ||
        p.supplierFirm.toLowerCase().includes(term) ||
        p.supplierName.toLowerCase().includes(term);

      return matchesTab && matchesSearch;
    });
  }, [purchases, activeTab, searchTerm]);

  const exportColumns = [
    { header: 'Purchase No', key: 'purchaseNumber' },
    { header: 'Supplier Bill No', key: 'supplierInvoiceNumber' },
    { header: 'Date', key: 'purchaseDate' },
    { header: 'Supplier Firm', key: 'supplierFirm' },
    { header: 'GSTIN', key: 'supplierGstin' },
    { header: 'Total Amount', key: 'grandTotal' },
    { header: 'Paid Amount', key: 'amountPaid' },
    { header: 'Balance Due', key: 'balanceDue' },
    { header: 'Status', key: 'paymentStatus' },
  ];

  const handleExportExcel = () => {
    exportToExcel(exportColumns, filteredPurchases, `Purchase_Register_${Date.now()}`);
  };

  const handleExportCsv = () => {
    exportToCsv(exportColumns, filteredPurchases, `Purchase_Register_${Date.now()}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400">
              <ShoppingCart className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Purchase & Raw Material Procurement
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Goyal Cattle Feed Pvt. Ltd. | Maize, Soybean DOC, Mustard Cake & Bag Inward Bills
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            Export Excel
          </button>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>

          <button
            onClick={() => setIsCreatePurchaseOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Record Purchase Bill
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Today's Procurement</span>
          <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block truncate font-mono">
            {formatIndianCurrency(metrics.todayPurchases)}
          </span>
          <span className="text-[10px] text-blue-600 font-medium">Grain Mandi Inflow</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Monthly Purchases</span>
          <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block truncate font-mono">
            {formatIndianCurrency(metrics.monthlyPurchases)}
          </span>
          <span className="text-[10px] text-blue-600 font-medium">November 2026</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Total Purchases</span>
          <span className="text-base font-bold text-blue-700 dark:text-blue-400 mt-1 block truncate font-mono">
            {formatIndianCurrency(metrics.totalPurchases)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Cumulative Procurement</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Total Purchase Bills</span>
          <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block font-mono">
            {metrics.totalBills}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Vouchers Logged</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Pending Payables</span>
          <span className="text-base font-bold text-red-600 mt-1 block truncate font-mono">
            {formatIndianCurrency(metrics.pendingPayments)}
          </span>
          <span className="text-[10px] text-red-600 font-medium">Supplier Balance Due</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Controls */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
          
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs">
            {(['All', 'Paid', 'Unpaid', 'Partially Paid'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab}
                <span className="ml-1.5 opacity-70 text-[10px]">
                  (
                  {tab === 'All'
                    ? purchases.length
                    : purchases.filter(p => p.paymentStatus === tab).length}
                  )
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search voucher, supplier bill, firm..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Purchase No.</th>
                <th className="p-3">Supplier Bill No.</th>
                <th className="p-3">Date</th>
                <th className="p-3">Supplier / Miller Firm</th>
                <th className="p-3 text-right">Gross Total</th>
                <th className="p-3 text-right">Paid</th>
                <th className="p-3 text-right">Balance Due</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No purchase records match the current criteria.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                      {p.purchaseNumber}
                    </td>

                    <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                      {p.supplierInvoiceNumber}
                    </td>

                    <td className="p-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {p.purchaseDate}
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{p.supplierFirm}</div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        GST: {p.supplierGstin || 'URP'}
                      </span>
                    </td>

                    <td className="p-3 text-right font-bold text-slate-900 dark:text-white font-mono">
                      ₹{p.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="p-3 text-right font-medium text-emerald-600 font-mono">
                      ₹{p.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="p-3 text-right font-bold font-mono">
                      <span className={p.balanceDue > 0 ? 'text-red-600' : 'text-slate-400'}>
                        ₹{p.balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded font-semibold whitespace-nowrap ${
                          p.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : p.paymentStatus === 'Partially Paid'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => setViewingPurchase(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300 font-medium"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* View Purchase Modal */}
      {viewingPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Purchase Voucher: {viewingPurchase.purchaseNumber}
                </h3>
              </div>
              <button
                onClick={() => setViewingPurchase(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-lg">
                <div>
                  <span className="text-slate-500 block">Supplier Firm:</span>
                  <strong className="text-slate-900 dark:text-white">{viewingPurchase.supplierFirm}</strong>
                  <p className="text-slate-600 font-mono">GST: {viewingPurchase.supplierGstin || 'URP'}</p>
                </div>
                <div>
                  <span className="text-slate-500 block">Bill Details:</span>
                  <p>Supplier Bill: <strong className="font-mono">{viewingPurchase.supplierInvoiceNumber}</strong></p>
                  <p>Date: <strong>{viewingPurchase.purchaseDate}</strong></p>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Purchased Raw Materials:</span>
                <table className="w-full border border-slate-200 dark:border-slate-800 rounded">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="p-2 text-left">Item</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Rate</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingPurchase.items.map((it, i) => (
                      <tr key={i} className="border-t border-slate-200 dark:border-slate-800">
                        <td className="p-2 font-medium">{it.productName}</td>
                        <td className="p-2 text-center">{it.quantity} {it.unit}</td>
                        <td className="p-2 text-right">₹{it.purchaseRate}</td>
                        <td className="p-2 text-right font-mono font-bold">₹{it.totalAmount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">
                  Paid: ₹{viewingPurchase.amountPaid.toLocaleString('en-IN')} | Due: <strong className="text-red-600">₹{viewingPurchase.balanceDue.toLocaleString('en-IN')}</strong>
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  Total: ₹{viewingPurchase.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setViewingPurchase(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreatePurchaseOpen && (
        <PurchaseCreatorModal onClose={() => setIsCreatePurchaseOpen(false)} />
      )}

    </div>
  );
};
