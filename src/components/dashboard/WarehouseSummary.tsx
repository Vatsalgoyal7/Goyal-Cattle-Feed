import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatIndianCurrency } from '../../data/sampleData';
import { Warehouse, AlertCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const WarehouseSummary: React.FC = () => {
  const { warehouses, t } = useApp();

  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.warehouseSummary}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Godown storage capacity, current valuation & safety buffers
          </p>
        </div>

        <NavLink
          to="/warehouses"
          className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
        >
          {t.viewAll}
        </NavLink>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {warehouses.map(wh => (
          <div
            key={wh.id}
            className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
                  <Warehouse className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {wh.name}
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {wh.location}
                  </span>
                </div>
              </div>

              {wh.lowStockItemsCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                  <AlertCircle className="w-3 h-3" /> {wh.lowStockItemsCount} Low
                </span>
              )}
            </div>

            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Total Stored:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                  {wh.totalStockBags.toLocaleString()} Units
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Stock Valuation:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {formatIndianCurrency(wh.totalStockValue)}
                </span>
              </div>

              {/* Capacity Progress Bar */}
              <div className="pt-1.5">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Occupancy</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {wh.capacityUtilization}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      wh.capacityUtilization > 80
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${wh.capacityUtilization}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
