import React, { useState, useMemo } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { LedgerEntry } from '../../types';
import { formatIndianCurrency } from '../../data/sampleData';
import { exportTableToPdf, exportToExcel, exportToCsv, printDocument } from '../../utils/exportUtils';
import {
  BookOpen,
  DollarSign,
  Download,
  Printer,
  FileSpreadsheet,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Building,
  Users,
  Wallet,
} from 'lucide-react';

export const AccountsDashboard: React.FC = () => {
  const { ledgers, customers, suppliers } = useEnterprise();

  const [activeBook, setActiveBook] = useState<'All' | 'Customer Ledger' | 'Supplier Ledger' | 'Cash Book' | 'Bank Book'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('');

  // Running balance calculation & filtering
  const filteredLedgers = useMemo(() => {
    return ledgers.filter(entry => {
      let matchesBook = true;
      if (activeBook === 'Customer Ledger') matchesBook = entry.partyType === 'Customer';
      else if (activeBook === 'Supplier Ledger') matchesBook = entry.partyType === 'Supplier';
      else if (activeBook === 'Cash Book') matchesBook = entry.particulars.toLowerCase().includes('cash');
      else if (activeBook === 'Bank Book') matchesBook = entry.particulars.toLowerCase().includes('bank') || entry.particulars.toLowerCase().includes('rtgs') || entry.particulars.toLowerCase().includes('neft');

      const matchesParty = !selectedParty || entry.partyId === selectedParty || entry.partyName === selectedParty;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        entry.partyName.toLowerCase().includes(term) ||
        entry.particulars.toLowerCase().includes(term) ||
        entry.transactionId.toLowerCase().includes(term);

      return matchesBook && matchesParty && matchesSearch;
    });
  }, [ledgers, activeBook, selectedParty, searchTerm]);

  // Aggregate stats
  const totals = useMemo(() => {
    let totalDebit = 0;
    let totalCredit = 0;
    filteredLedgers.forEach(l => {
      totalDebit += l.debit;
      totalCredit += l.credit;
    });
    return {
      totalDebit,
      totalCredit,
      netDifference: totalDebit - totalCredit,
    };
  }, [filteredLedgers]);

  const exportCols = [
    { header: 'Date', key: 'date' },
    { header: 'Transaction / Ref', key: 'transactionId' },
    { header: 'Party Name', key: 'partyName' },
    { header: 'Particulars', key: 'particulars' },
    { header: 'Debit (Dr)', key: 'debit' },
    { header: 'Credit (Cr)', key: 'credit' },
    { header: 'Type', key: 'type' },
  ];

  const handleExportPdf = () => {
    exportTableToPdf(
      `ACCOUNTS & KHATA STATEMENT - ${activeBook.toUpperCase()}`,
      `Goyal Cattle Feed Pvt. Ltd. | Total Dr: ₹${totals.totalDebit.toLocaleString('en-IN')} | Total Cr: ₹${totals.totalCredit.toLocaleString('en-IN')}`,
      exportCols,
      filteredLedgers,
      `Accounts_Statement_${Date.now()}`
    );
  };

  const handleExportExcel = () => {
    exportToExcel(exportCols, filteredLedgers, `Khata_${activeBook}_${Date.now()}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Accounts & Khata Ledger
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Goyal Cattle Feed Pvt. Ltd. | Customer & Supplier Double-Entry Ledgers, Cash Book & Bank Book
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
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Statement PDF
          </button>

          <button
            onClick={() => printDocument()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Ledger
          </button>
        </div>
      </div>

      {/* Book Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Debits (Dr)</span>
            <ArrowDownLeft className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-lg font-bold text-red-600 mt-1 block font-mono">
            {formatIndianCurrency(totals.totalDebit)}
          </span>
          <span className="text-[10px] text-slate-400">Total Bill Invoiced / Disbursed</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Credits (Cr)</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-lg font-bold text-emerald-600 mt-1 block font-mono">
            {formatIndianCurrency(totals.totalCredit)}
          </span>
          <span className="text-[10px] text-slate-400">Total Payments Received / Credited</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Net Balance Difference</span>
            <Wallet className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white mt-1 block font-mono">
            {formatIndianCurrency(totals.netDifference)}
          </span>
          <span className="text-[10px] text-slate-400">Cumulative Net Ledger Position</span>
        </div>
      </div>

      {/* Main Ledger Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Book Selectors & Filter bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
          
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {(['All', 'Customer Ledger', 'Supplier Ledger', 'Cash Book', 'Bank Book'] as const).map(book => (
              <button
                key={book}
                type="button"
                onClick={() => setActiveBook(book)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                  activeBook === book
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {book}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedParty}
              onChange={e => setSelectedParty(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value="">Filter by Specific Party...</option>
              <optgroup label="Customers">
                {customers.map(c => (
                  <option key={c.id} value={c.firmName}>
                    {c.firmName}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Suppliers">
                {suppliers.map(s => (
                  <option key={s.id} value={s.firmName}>
                    {s.firmName}
                  </option>
                ))}
              </optgroup>
            </select>

            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search Khata entries..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Transaction / Ref</th>
                <th className="p-3">Party Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Particulars & Description</th>
                <th className="p-3 text-right">Debit (Dr)</th>
                <th className="p-3 text-right">Credit (Cr)</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredLedgers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No ledger entries found for selected criteria.
                  </td>
                </tr>
              ) : (
                filteredLedgers.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {l.date}
                    </td>

                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                      {l.transactionId}
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{l.partyName}</div>
                      <span className="text-[10px] text-slate-500">{l.partyType}</span>
                    </td>

                    <td className="p-3">
                      <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {l.type}
                      </span>
                    </td>

                    <td className="p-3 text-slate-700 dark:text-slate-300">
                      {l.particulars}
                    </td>

                    <td className="p-3 text-right font-mono font-bold">
                      {l.debit > 0 ? (
                        <span className="text-red-600">₹{l.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="p-3 text-right font-mono font-bold">
                      {l.credit > 0 ? (
                        <span className="text-emerald-600">₹{l.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {l.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
