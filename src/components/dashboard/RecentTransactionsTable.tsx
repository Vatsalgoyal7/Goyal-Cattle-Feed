import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatIndianCurrency } from '../../data/sampleData';
import { FileText, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const RecentTransactionsTable: React.FC = () => {
  const { transactions, t } = useApp();

  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.recentTransactions}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time sales invoices, purchase bookings, and receipt vouchers
          </p>
        </div>

        <NavLink
          to="/app/sales"
          className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
        >
          {t.viewAll}
        </NavLink>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Voucher / Invoice</th>
              <th className="py-2.5 px-3">Party / Account</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.slice(0, 6).map(txn => {
              const isIncome = txn.type === 'Sales' || txn.type === 'Receipt';
              return (
                <tr
                  key={txn.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{txn.invoiceNumber}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                    {txn.partyName}
                    <div className="text-[10px] text-slate-400">{txn.branch}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                        isIncome
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-3 h-3" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3" />
                      )}
                      {txn.type}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {txn.date}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                    <span
                      className={
                        isIncome
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-white'
                      }
                    >
                      {formatIndianCurrency(txn.amount || 0)}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        txn.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : txn.status === 'Credit'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
