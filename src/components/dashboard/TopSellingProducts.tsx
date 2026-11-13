import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatIndianCurrency } from '../../data/sampleData';
import { Package } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const TopSellingProducts: React.FC = () => {
  const { products, t } = useApp();

  const finishedProducts = (products || [])
    .filter(p => p.category === 'Finished Feed' || (p as any).productType === 'Finished')
    .sort((a, b) => ((b.salesValueToday || 0) - (a.salesValueToday || 0)));

  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.topSellingProducts}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            High performance feed lines dispatched today
          </p>
        </div>

        <NavLink
          to="/app/stock"
          className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
        >
          {t.viewAll}
        </NavLink>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Product Name</th>
              <th className="py-2.5 px-3 text-right">Sold Today</th>
              <th className="py-2.5 px-3 text-right">Sales Turnover</th>
              <th className="py-2.5 px-3 text-right">Stock Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {finishedProducts.map(p => (
              <tr
                key={p.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        SKU: {p.sku} · ₹{p.ratePerUnit}/{p.unit}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-3 text-right font-mono font-medium text-slate-900 dark:text-white tabular-nums">
                  {p.bagsSoldToday || 0} Bags
                </td>

                <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {formatIndianCurrency(p.salesValueToday || 0)}
                </td>

                <td className="py-3 px-3 text-right">
                  <span className="font-mono text-slate-700 dark:text-slate-300 tabular-nums font-medium">
                    {(p.currentStock || 0).toLocaleString()} Bags
                  </span>
                  <div className="text-[10px] text-emerald-600 font-medium">
                    In Buffer
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
