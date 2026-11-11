import React, { useState, useMemo } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { useApp } from '../../context/AppContext';
import { ExpenseItem, PaymentMode } from '../../types';
import { formatIndianCurrency } from '../../data/sampleData';
import { exportToExcel, exportToCsv } from '../../utils/exportUtils';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Trash2,
  DollarSign,
  TrendingDown,
  PieChart,
  X,
  AlertCircle,
} from 'lucide-react';

const EXPENSE_CATEGORIES = [
  'Factory Power & Electricity',
  'Boiler Fuel & Biomass Briquettes',
  'Machine Maintenance & Spares',
  'Contract Bag Loading Labour',
  'Office Staff Salaries & Overtime',
  'Truck Diesel & Fleet Maintenance',
  'Plant Rent & Godown Lease',
  'Printing & Packaging Bags',
  'Laboratory Testing & Nutrition QC',
  'Sales Travel & Dealer Meetings',
  'Bank Interest & Processing Charges',
  'Miscellaneous / Office Overheads',
];

export const ExpenseDashboard: React.FC = () => {
  const { expenses, addExpense, deleteExpense } = useEnterprise();
  const { userProfile } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New expense form state
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [gstAmount, setGstAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Bank Transfer');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [error, setError] = useState('');

  // Metrics
  const metrics = useMemo(() => {
    let totalExpense = 0;
    const catMap: { [cat: string]: number } = {};

    expenses.forEach(e => {
      totalExpense += e.amount;
      catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    });

    return {
      totalExpense,
      totalVouchers: expenses.length,
      categoryDistribution: catMap,
    };
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        e.expenseNumber.toLowerCase().includes(term) ||
        e.vendor.toLowerCase().includes(term) ||
        e.description.toLowerCase().includes(term) ||
        e.category.toLowerCase().includes(term);

      return matchesCat && matchesSearch;
    });
  }, [expenses, selectedCategory, searchTerm]);

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0 || !vendor) {
      setError('Vendor / Payee and valid Amount are required');
      return;
    }

    addExpense({
      expenseDate,
      category,
      description: description || `${category} payment to ${vendor}`,
      vendor,
      amount: Number(amount),
      gstAmount: Number(gstAmount) || 0,
      paymentMode,
      referenceNumber,
      createdBy: userProfile?.fullName || 'Accountant',
    });

    setIsAddModalOpen(false);
    setVendor('');
    setDescription('');
    setAmount(0);
    setGstAmount(0);
    setReferenceNumber('');
    setError('');
  };

  const exportCols = [
    { header: 'Expense No', key: 'expenseNumber' },
    { header: 'Date', key: 'expenseDate' },
    { header: 'Category', key: 'category' },
    { header: 'Vendor / Payee', key: 'vendor' },
    { header: 'Description', key: 'description' },
    { header: 'Amount', key: 'amount' },
    { header: 'GST Included', key: 'gstAmount' },
    { header: 'Payment Mode', key: 'paymentMode' },
    { header: 'Reference', key: 'referenceNumber' },
    { header: 'Logged By', key: 'createdBy' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400">
              <CreditCard className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Factory & Operational Expenses
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Goyal Cattle Feed Pvt. Ltd. | Power, Boiler Fuel, Loading Labour, Machine Spares & Overheads
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportToExcel(exportCols, filteredExpenses, `Expenses_${Date.now()}`)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-red-600" />
            Export Excel
          </button>

          <button
            onClick={() => exportToCsv(exportCols, filteredExpenses, `Expenses_${Date.now()}`)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Record Expense Voucher
          </button>
        </div>
      </div>

      {/* Expense KPI Top Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Total Operational Expenses</span>
          <span className="text-lg font-bold text-red-600 mt-1 block font-mono">
            {formatIndianCurrency(metrics.totalExpense)}
          </span>
          <span className="text-[10px] text-slate-400">Total Factory Outflow</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Expense Vouchers Logged</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white mt-1 block font-mono">
            {metrics.totalVouchers} Vouchers
          </span>
          <span className="text-[10px] text-slate-400">Audit-ready Records</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block truncate">Highest Cost Driver</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block truncate">
            Power & Boiler Fuel
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">Core Plant Utility</span>
        </div>
      </div>

      {/* Main Expense Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Controls */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs max-w-xs"
            >
              <option value="All">All 12 Expense Categories</option>
              {EXPENSE_CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search vendor, description, voucher..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Voucher No.</th>
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Vendor / Payee</th>
                <th className="p-3">Description & Reference</th>
                <th className="p-3">Mode</th>
                <th className="p-3 text-right">Amount (₹)</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                      {exp.expenseNumber}
                    </td>

                    <td className="p-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {exp.expenseDate}
                    </td>

                    <td className="p-3">
                      <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                        {exp.category}
                      </span>
                    </td>

                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {exp.vendor}
                    </td>

                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      <div>{exp.description}</div>
                      {exp.referenceNumber && (
                        <span className="text-[10px] text-slate-400 font-mono">Ref: {exp.referenceNumber}</span>
                      )}
                    </td>

                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      {exp.paymentMode}
                    </td>

                    <td className="p-3 text-right font-bold text-red-600 font-mono text-sm">
                      ₹{exp.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          if (confirm('Delete this expense voucher?')) {
                            deleteExpense(exp.id);
                          }
                        }}
                        className="p-1 rounded text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Record Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Record Factory Expense Voucher
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="px-6 py-2 bg-red-50 text-red-700 text-xs flex items-center gap-2 border-b border-red-200">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleSaveExpense} className="p-6 space-y-3 text-xs overflow-y-auto">
              <div>
                <label className="block font-semibold mb-1">Expense Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                >
                  {EXPENSE_CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Vendor / Payee Name *</label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={e => setVendor(e.target.value)}
                    placeholder="e.g. PSPCL Khanna (Electricity)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    value={amount || ''}
                    onChange={e => setAmount(Number(e.target.value))}
                    placeholder="e.g. 84500"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value as PaymentMode)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="Bank Transfer">Bank Transfer (HDFC Bank)</option>
                    <option value="Cash">Petty Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Date</label>
                  <input
                    type="text"
                    value={expenseDate}
                    onChange={e => setExpenseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Voucher Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Power bill for October 2026 for Pellet Mill #1"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Bill / Cheque / UTR Reference No.</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={e => setReferenceNumber(e.target.value)}
                  placeholder="e.g. BILL-PSPCL-10293"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
