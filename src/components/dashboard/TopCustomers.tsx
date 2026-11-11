import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatIndianCurrency } from '../../data/sampleData';
import { Building2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const TopCustomers: React.FC = () => {
  const { customers, t } = useApp();

  const sortedCustomers = [...customers].sort(
    (a, b) => b.totalPurchases - a.totalPurchases
  );

  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.topCustomers}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Key feed distribution dealers and commercial dairy partners
          </p>
        </div>

        <NavLink
          to="/customers"
          className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
        >
          {t.viewAll}
        </NavLink>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Dealer / Client</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3 text-right">Lifetime Sales</th>
              <th className="py-2.5 px-3 text-right">Outstanding Khata</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedCustomers.slice(0, 5).map(c => (
              <tr
                key={c.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {c.firmName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Prop: {c.name} · {c.phone}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                  {c.city}, {c.state}
                </td>

                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatIndianCurrency(c.totalPurchases)}
                </td>

                <td className="py-3 px-3 text-right font-mono font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                  {formatIndianCurrency(c.outstandingAmount)}
                </td>

                <td className="py-3 px-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      c.paymentStatus === 'Good'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : c.paymentStatus === 'Attention'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                  >
                    {c.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
