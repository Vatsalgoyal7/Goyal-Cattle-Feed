import React, { useState, useMemo } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { FullSupplier } from '../../types';
import { SupplierProfileModal } from './SupplierProfileModal';
import { AddSupplierModal } from './AddSupplierModal';
import { formatIndianCurrency } from '../../data/sampleData';
import { exportToExcel, exportToCsv } from '../../utils/exportUtils';
import {
  Building2,
  Plus,
  Search,
  Download,
  FileSpreadsheet,
  Eye,
  CreditCard,
  Truck,
  CheckCircle,
} from 'lucide-react';

export const SupplierDashboard: React.FC = () => {
  const {
    suppliers,
    selectedSupplierProfile,
    setSelectedSupplierProfile,
    isAddSupplierOpen,
    setIsAddSupplierOpen,
  } = useEnterprise();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingSupplier, setEditingSupplier] = useState<FullSupplier | undefined>(undefined);

  const metrics = useMemo(() => {
    let totalPurchases = 0;
    let totalPayables = 0;

    suppliers.forEach(s => {
      totalPurchases += s.totalPurchases;
      totalPayables += s.currentPayable;
    });

    return {
      totalSuppliers: suppliers.length,
      activeSuppliers: suppliers.filter(s => s.status === 'Active').length,
      totalPurchases,
      totalPayables,
    };
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const term = searchTerm.toLowerCase();
      return (
        !term ||
        s.firmName.toLowerCase().includes(term) ||
        s.name.toLowerCase().includes(term) ||
        s.city.toLowerCase().includes(term) ||
        s.suppliedProducts.some(p => p.toLowerCase().includes(term))
      );
    });
  }, [suppliers, searchTerm]);

  const exportCols = [
    { header: 'Supplier ID', key: 'supplierId' },
    { header: 'Firm Name', key: 'firmName' },
    { header: 'Contact', key: 'name' },
    { header: 'Phone', key: 'phone' },
    { header: 'City', key: 'city' },
    { header: 'GSTIN', key: 'gstin' },
    { header: 'Total Purchases', key: 'totalPurchases' },
    { header: 'Current Payable', key: 'currentPayable' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Supplier & Grain Miller Directory
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Goyal Cattle Feed Pvt. Ltd. | Raw Material Vendors, Oil Extraction Plants & Packaging Suppliers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportToExcel(exportCols, filteredSuppliers, `Suppliers_${Date.now()}`)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            Export Excel
          </button>

          <button
            onClick={() => {
              setEditingSupplier(undefined);
              setIsAddSupplierOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Register Supplier
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Total Suppliers</span>
          <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block font-mono">
            {metrics.totalSuppliers}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Registered Millers & Vendors</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Active Suppliers</span>
          <span className="text-base font-bold text-emerald-600 mt-1 block font-mono">
            {metrics.activeSuppliers}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">Supplying Raw Materials</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Total Raw Material Purchased</span>
          <span className="text-base font-bold text-blue-700 dark:text-blue-400 mt-1 block font-mono">
            {formatIndianCurrency(metrics.totalPurchases)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Cumulative Procurement</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Outstanding Payables</span>
          <span className="text-base font-bold text-red-600 mt-1 block font-mono">
            {formatIndianCurrency(metrics.totalPayables)}
          </span>
          <span className="text-[10px] text-red-600 font-medium">Pending Supplier Dues</span>
        </div>
      </div>

      {/* Suppliers Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Registered Vendor Directory ({filteredSuppliers.length})
          </span>

          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search supplier, item (Maize, DOC)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Supplier Firm</th>
                <th className="p-3">Contact Person</th>
                <th className="p-3">Location</th>
                <th className="p-3">Supplied Commodities</th>
                <th className="p-3 text-center">Credit Days</th>
                <th className="p-3 text-right">Total Purchases</th>
                <th className="p-3 text-right">Current Payable</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredSuppliers.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{s.firmName}</div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {s.supplierId} | GST: {s.gstin || 'None'}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{s.name}</div>
                    <span className="text-[10px] text-slate-500 font-mono">{s.phone}</span>
                  </td>

                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {s.city}, {s.state}
                  </td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {s.suppliedProducts.map((p, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-3 text-center font-mono">
                    {s.creditDays} Days
                  </td>

                  <td className="p-3 text-right font-semibold font-mono">
                    ₹{s.totalPurchases.toLocaleString('en-IN')}
                  </td>

                  <td className="p-3 text-right font-bold font-mono">
                    <span className={s.currentPayable > 0 ? 'text-red-600' : 'text-slate-400'}>
                      ₹{s.currentPayable.toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedSupplierProfile(s)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-blue-600 font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Khata
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modals */}
      {selectedSupplierProfile && (
        <SupplierProfileModal
          supplier={selectedSupplierProfile}
          onClose={() => setSelectedSupplierProfile(null)}
          onEdit={s => {
            setSelectedSupplierProfile(null);
            setEditingSupplier(s);
            setIsAddSupplierOpen(true);
          }}
        />
      )}

      {isAddSupplierOpen && (
        <AddSupplierModal
          onClose={() => setIsAddSupplierOpen(false)}
          existingSupplier={editingSupplier}
        />
      )}

    </div>
  );
};
