import React, { useState, useMemo } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { SalesInvoice, InvoicePaymentStatus } from '../../types';
import { InvoicePreviewModal } from './InvoicePreviewModal';
import { InvoiceCreator } from './InvoiceCreator';
import { generateInvoicePdf, printDocument, shareViaWhatsApp, exportToExcel, exportToCsv } from '../../utils/exportUtils';
import { formatIndianCurrency } from '../../data/sampleData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Share2,
  Eye,
  Copy,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';

const SALES_TREND_DATA = [
  { day: '05 Nov', sales: 185000, collections: 140000 },
  { day: '06 Nov', sales: 242000, collections: 210000 },
  { day: '07 Nov', sales: 198000, collections: 175000 },
  { day: '08 Nov', sales: 310000, collections: 280000 },
  { day: '09 Nov', sales: 275000, collections: 230000 },
  { day: '10 Nov', sales: 380000, collections: 320000 },
  { day: '11 Nov', sales: 425000, collections: 295000 },
];

export const SalesDashboard: React.FC = () => {
  const {
    invoices,
    updateInvoiceStatus,
    duplicateInvoice,
    previewInvoice,
    setPreviewInvoice,
    isCreateInvoiceOpen,
    setIsCreateInvoiceOpen,
    setIsRecordPaymentOpen,
  } = useEnterprise();

  const [activeTab, setActiveTab] = useState<'All' | 'Completed' | 'Pending Payment' | 'Partially Paid' | 'Draft' | 'Cancelled'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionInvoice, setSelectedActionInvoice] = useState<string | null>(null);

  // Summary Metrics calculations
  const metrics = useMemo(() => {
    let todaySales = 0;
    let monthlySales = 0;
    let totalSales = 0;
    let paidInvoices = 0;
    let unpaidInvoices = 0;
    let partiallyPaidInvoices = 0;
    let cancelledInvoices = 0;

    const todayDate = new Date().toLocaleDateString('en-GB');

    invoices.forEach(inv => {
      if (inv.paymentStatus !== 'Cancelled') {
        totalSales += inv.grandTotal;
        if (inv.invoiceDate === todayDate || inv.invoiceDate.includes('11/11/2026')) {
          todaySales += inv.grandTotal;
        }
        monthlySales += inv.grandTotal;
      }

      if (inv.paymentStatus === 'Completed') paidInvoices++;
      else if (inv.paymentStatus === 'Pending Payment') unpaidInvoices++;
      else if (inv.paymentStatus === 'Partially Paid') partiallyPaidInvoices++;
      else if (inv.paymentStatus === 'Cancelled') cancelledInvoices++;
    });

    return {
      todaySales,
      monthlySales,
      totalSales,
      totalInvoices: invoices.length,
      paidInvoices,
      unpaidInvoices,
      partiallyPaidInvoices,
      cancelledInvoices,
    };
  }, [invoices]);

  // Tab Filtering & Search
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesTab = activeTab === 'All' || inv.paymentStatus === activeTab;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        inv.invoiceNumber.toLowerCase().includes(term) ||
        inv.customerName.toLowerCase().includes(term) ||
        inv.customerFirm.toLowerCase().includes(term) ||
        inv.customerPhone.includes(term) ||
        inv.documentType.toLowerCase().includes(term);

      return matchesTab && matchesSearch;
    });
  }, [invoices, activeTab, searchTerm]);

  // Excel & CSV Export handlers
  const exportColumns = [
    { header: 'Invoice Number', key: 'invoiceNumber' },
    { header: 'Document Type', key: 'documentType' },
    { header: 'Date', key: 'invoiceDate' },
    { header: 'Customer Name', key: 'customerName' },
    { header: 'Firm Name', key: 'customerFirm' },
    { header: 'Phone', key: 'customerPhone' },
    { header: 'Total Amount', key: 'grandTotal' },
    { header: 'Paid Amount', key: 'amountPaid' },
    { header: 'Balance Due', key: 'balanceDue' },
    { header: 'Status', key: 'paymentStatus' },
    { header: 'Created By', key: 'createdBy' },
  ];

  const handleExportExcel = () => {
    exportToExcel(exportColumns, filteredInvoices, `Sales_Register_${Date.now()}`);
  };

  const handleExportCsv = () => {
    exportToCsv(exportColumns, filteredInvoices, `Sales_Register_${Date.now()}`);
  };

  const handleCancelInvoice = (id: string) => {
    if (confirm('Are you sure you want to cancel this invoice? It will be marked Cancelled.')) {
      updateInvoiceStatus(id, 'Cancelled');
      setSelectedActionInvoice(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Receipt className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sales & Billing Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Goyal Cattle Feed Pvt. Ltd. | Commercial Invoicing, Tax Calculations & Receivable Tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Excel
          </button>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>

          <button
            onClick={() => setIsCreateInvoiceOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Sales Bill
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">Today's Sales</span>
          <span className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white mt-1 block font-mono whitespace-nowrap">
            {formatIndianCurrency(metrics.todaySales)}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">Daily Dispatch</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">Monthly Sales</span>
          <span className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white mt-1 block font-mono whitespace-nowrap">
            {formatIndianCurrency(metrics.monthlySales)}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">November 2026</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">Total Sales</span>
          <span className="text-xs sm:text-[13px] font-bold text-emerald-700 dark:text-emerald-400 mt-1 block font-mono whitespace-nowrap">
            {formatIndianCurrency(metrics.totalSales)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Cumulative Gross</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">Total Invoices</span>
          <span className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white mt-1 block font-mono">
            {metrics.totalInvoices}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Generated</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">Paid Invoices</span>
          <span className="text-xs sm:text-[13px] font-bold text-emerald-600 mt-1 block font-mono">
            {metrics.paidInvoices}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">Fully Cleared</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">Unpaid Invoices</span>
          <span className="text-xs sm:text-[13px] font-bold text-amber-600 mt-1 block font-mono">
            {metrics.unpaidInvoices}
          </span>
          <span className="text-[10px] text-amber-600 font-medium">Awaiting Payment</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">Partially Paid</span>
          <span className="text-xs sm:text-[13px] font-bold text-blue-600 mt-1 block font-mono">
            {metrics.partiallyPaidInvoices}
          </span>
          <span className="text-[10px] text-blue-600 font-medium">Partial Settlement</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">Cancelled</span>
          <span className="text-xs sm:text-[13px] font-bold text-rose-600 mt-1 block font-mono">
            {metrics.cancelledInvoices}
          </span>
          <span className="text-[10px] text-rose-600 font-medium">Void Invoices</span>
        </div>
      </div>

      {/* Sales Overview Chart */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              7-Day Sales & Payment Collections Trend
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily billing value versus bank/cash collections (in INR)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Sales Billed
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              Collections
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SALES_TREND_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
                tickFormatter={val => `₹${val / 1000}k`}
              />
              <Tooltip
                formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                name="Sales Billed"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#salesGrad)"
              />
              <Area
                type="monotone"
                dataKey="collections"
                name="Collections"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Transactions Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Controls Bar: Tabs & Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            {(['All', 'Completed', 'Pending Payment', 'Partially Paid', 'Draft', 'Cancelled'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
                <span className="ml-1.5 opacity-70 text-[10px]">
                  (
                  {tab === 'All'
                    ? invoices.length
                    : invoices.filter(i => i.paymentStatus === tab).length}
                  )
                </span>
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search invoice, customer, phone..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Invoice No.</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer Firm</th>
                <th className="p-3">Contact</th>
                <th className="p-3 text-right">Total Amount</th>
                <th className="p-3 text-right">Paid</th>
                <th className="p-3 text-right">Pending</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3">Created By</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    No invoices matching the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="p-3">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {inv.invoiceNumber}
                      </div>
                      <span className="text-[10px] text-slate-500 block">{inv.documentType}</span>
                    </td>

                    <td className="p-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {inv.invoiceDate}
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {inv.customerFirm || inv.customerName}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {inv.state} ({inv.stateCode})
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        {inv.customerName}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{inv.customerPhone}</div>
                    </td>

                    <td className="p-3 text-right font-bold text-slate-900 dark:text-white font-mono">
                      ₹{inv.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="p-3 text-right font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹{inv.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="p-3 text-right font-bold font-mono">
                      <span className={inv.balanceDue > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}>
                        ₹{inv.balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded font-semibold whitespace-nowrap ${
                          inv.paymentStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : inv.paymentStatus === 'Partially Paid'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : inv.paymentStatus === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>

                    <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">
                      {inv.createdBy}
                    </td>

                    <td className="p-3 text-right relative">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPreviewInvoice(inv)}
                          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                          title="View / Print Invoice"
                        >
                          <Eye className="w-4 h-4 text-emerald-600" />
                        </button>

                        <button
                          onClick={() => generateInvoicePdf(inv)}
                          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            const msg = `Namaste ${inv.customerName},\nYour invoice #${inv.invoiceNumber} for ₹${inv.grandTotal.toLocaleString('en-IN')} has been issued. Balance due: ₹${inv.balanceDue.toLocaleString('en-IN')}.\n- Goyal Cattle Feed Pvt. Ltd.`;
                            shareViaWhatsApp(inv.customerPhone, msg);
                          }}
                          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-green-600 transition"
                          title="WhatsApp Invoice"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>

                        {/* More Actions Toggle */}
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() =>
                              setSelectedActionInvoice(selectedActionInvoice === inv.id ? null : inv.id)
                            }
                            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {selectedActionInvoice === inv.id && (
                            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-20 py-1 text-xs">
                              <button
                                onClick={() => {
                                  duplicateInvoice(inv.id);
                                  setSelectedActionInvoice(null);
                                }}
                                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                Duplicate Invoice
                              </button>

                              {inv.balanceDue > 0 && inv.paymentStatus !== 'Cancelled' && (
                                <button
                                  onClick={() => {
                                    setIsRecordPaymentOpen(true);
                                    setSelectedActionInvoice(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-600 font-medium"
                                >
                                  <DollarSign className="w-3.5 h-3.5" />
                                  Record Payment
                                </button>
                              )}

                              {inv.paymentStatus !== 'Cancelled' && (
                                <button
                                  onClick={() => handleCancelInvoice(inv.id)}
                                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  Cancel Invoice
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modals */}
      {previewInvoice && (
        <InvoicePreviewModal
          invoice={previewInvoice}
          onClose={() => setPreviewInvoice(null)}
          onDuplicate={id => {
            const dup = duplicateInvoice(id);
            if (dup) setPreviewInvoice(dup);
          }}
        />
      )}

      {isCreateInvoiceOpen && (
        <InvoiceCreator onClose={() => setIsCreateInvoiceOpen(false)} />
      )}

    </div>
  );
};
