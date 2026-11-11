import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, ShoppingCart } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const LowStockAlerts: React.FC = () => {
  const { products, setActiveQuickAction, t } = useApp();

  // Find products where currentStock < minStockLevel
  const lowStockItems = products.filter(p => p.currentStock < p.minStockLevel);

  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            {t.lowStockAlerts}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Raw materials or finished feeds below minimum factory safety thresholds
          </p>
        </div>

        <NavLink
          to="/stock"
          className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
        >
          {t.viewAll}
        </NavLink>
      </div>

      <div className="space-y-3">
        {lowStockItems.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            All inventory levels are above minimum safety thresholds.
          </div>
        ) : (
          lowStockItems.map(item => {
            const deficit = item.minStockLevel - item.currentStock;
            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded">
                      Shortage: -{deficit} {item.unit}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    Warehouse: <span className="font-medium">{item.warehouse}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                    <span>
                      Available: <strong className="text-rose-600 font-bold">{item.currentStock} {item.unit}</strong>
                    </span>
                    <span>·</span>
                    <span>Min Safety Buffer: <strong>{item.minStockLevel} {item.unit}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setActiveQuickAction('add_purchase')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{t.reorder}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
