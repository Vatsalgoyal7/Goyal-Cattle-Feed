import React, { useState, useMemo } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { FullCustomer, CustomerCategory } from '../../types';
import { CustomerProfileModal } from './CustomerProfileModal';
import { AddCustomerModal } from './AddCustomerModal';
import { formatIndianCurrency } from '../../data/sampleData';
import { exportToExcel, exportToCsv, shareViaWhatsApp } from '../../utils/exportUtils';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Building,
  Phone,
  Eye,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Share2,
  FileText,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    customers,
    selectedCustomerProfile,
    setSelectedCustomerProfile,
    isAddCustomerOpen,
    setIsAddCustomerOpen,
    setIsCreateInvoiceOpen,
    setIsRecordPaymentOpen,
  } = useEnterprise();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<FullCustomer | undefined>(undefined);

  // Summary Metrics
  const metrics = useMemo(() => {
    let totalOutstanding = 0;
    let totalSales = 0;
    let highRiskCount = 0;

    customers.forEach(c => {
      totalOutstanding += c.currentOutstanding;
      totalSales += c.totalSales;
      const utilization = (c.currentOutstanding / (c.creditLimit || 1)) * 100;
      if (utilization >= 80) highRiskCount++;
    });

    return {
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.status === 'Active').length,
      totalOutstanding,
      totalSales,
      highRiskCount,
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.firmName.toLowerCase().includes(term) ||
        c.city.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        (c.gstin && c.gstin.toLowerCase().includes(term));

      return matchesCat && matchesSearch;
    });
  }, [customers, selectedCategory, searchTerm]);

  const exportCols = [
    { header: 'Customer ID', key: 'customerId' },
    { header: 'Firm Name', key: 'firmName' },
    { header: 'Contact Person', key: 'name' },
    { header: 'Phone', key: 'phone' },
    { header: 'City', key: 'city' },
    { header: 'State', key: 'state' },
    { header: 'GSTIN', key: 'gstin' },
    { header: 'Credit Limit', key: 'creditLimit' },
    { header: 'Outstanding', key: 'currentOutstanding' },
    { header: 'Total Sales', key: 'totalSales' },
    { header: 'Last Purchase', key: 'lastPurchaseDate' },
  ];

  const handleExportExcel = () => {
    exportToExcel(exportCols, filteredCustomers, `Customer_Directory_${Date.now()}`);
  };

  const handleExportCsv = () => {
    exportToCsv(exportCols, filteredCustomers, `Customer_Directory_${Date.now()}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Customer & Dealer Directory
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Goyal Cattle Feed Pvt. Ltd. | Authorized Feed Dealers, Wholesalers & Commercial Dairies
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
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
            onClick={() => {
              setEditingCustomer(undefined);
              setIsAddCustomerOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Customer
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Total Dealers</span>
          <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block font-mono">
            {metrics.totalCustomers}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Registered</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Active Dealers</span>
          <span className="text-base font-bold text-emerald-600 mt-1 block font-mono">
            {metrics.activeCustomers}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">Ordering Regularly</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Total Outstanding</span>
          <span className="text-base font-bold text-red-600 mt-1 block truncate font-mono">
            {formatIndianCurrency(metrics.totalOutstanding)}
          </span>
          <span className="text-[10px] text-red-600 font-medium">Market Receivables</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Total Lifetime Sales</span>
          <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-1 block truncate font-mono">
            {formatIndianCurrency(metrics.totalSales)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Cumulative Gross</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Near Credit Limit</span>
          <span className="text-base font-bold text-amber-600 mt-1 block font-mono">
            {metrics.highRiskCount}
          </span>
          <span className="text-[10px] text-amber-600 font-medium">&gt;80% Limit Utilized</span>
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Controls Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
          
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {['All', 'Dealer', 'Wholesale', 'Dairy Farm', 'Retail'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search dealer, contact, phone, city..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Dealers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Customer / Dealer</th>
                <th className="p-3">Contact Person</th>
                <th className="p-3">Location</th>
                <th className="p-3">Category</th>
                <th className="p-3">Credit Limit & Usage</th>
                <th className="p-3 text-right">Outstanding</th>
                <th className="p-3 text-right">Total Purchases</th>
                <th className="p-3 text-center">Last Purchase</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No customers found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(c => {
                  const usage = Math.min(100, Math.round((c.currentOutstanding / (c.creditLimit || 1)) * 100));
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{c.firmName}</div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {c.customerId} {c.gstin && `| GST: ${c.gstin}`}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{c.name}</div>
                        <span className="text-[10px] text-slate-500 font-mono">{c.phone}</span>
                      </td>

                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        {c.city}, {c.state}
                      </td>

                      <td className="p-3">
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {c.category}
                        </span>
                      </td>

                      <td className="p-3 w-48">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                          <span>Limit: ₹{(c.creditLimit / 100000).toFixed(1)}L</span>
                          <span className={usage > 80 ? 'text-red-600 font-bold' : 'text-slate-600'}>
                            {usage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              usage > 80 ? 'bg-red-500' : usage > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${usage}%` }}
                          ></div>
                        </div>
                      </td>

                      <td className="p-3 text-right font-bold font-mono">
                        <span className={c.currentOutstanding > 0 ? 'text-red-600' : 'text-emerald-600'}>
                          ₹{c.currentOutstanding.toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td className="p-3 text-right font-semibold text-slate-900 dark:text-white font-mono">
                        ₹{c.totalSales.toLocaleString('en-IN')}
                      </td>

                      <td className="p-3 text-center text-slate-600 dark:text-slate-400 whitespace-nowrap text-[11px]">
                        {c.lastPurchaseDate}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedCustomerProfile(c)}
                            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-600"
                            title="View Full Profile & Khata"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              const msg = `Namaste ${c.name} Ji,\nStatement reminder from Goyal Cattle Feed Pvt. Ltd. Current ledger balance: ₹${c.currentOutstanding.toLocaleString('en-IN')}.`;
                              shareViaWhatsApp(c.phone, msg);
                            }}
                            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-green-600"
                            title="WhatsApp Ledger Reminder"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modals */}
      {selectedCustomerProfile && (
        <CustomerProfileModal
          customer={selectedCustomerProfile}
          onClose={() => setSelectedCustomerProfile(null)}
          onEdit={c => {
            setSelectedCustomerProfile(null);
            setEditingCustomer(c);
            setIsAddCustomerOpen(true);
          }}
        />
      )}

      {isAddCustomerOpen && (
        <AddCustomerModal
          onClose={() => setIsAddCustomerOpen(false)}
          existingCustomer={editingCustomer}
        />
      )}

    </div>
  );
};
