import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Clock } from 'lucide-react';

export const RecentActivityFeed: React.FC = () => {
  const { activities, t } = useApp();

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Sales':
        return 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/60';
      case 'Purchase':
        return 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/60';
      case 'Production':
        return 'text-teal-700 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/60';
      case 'Inventory':
        return 'text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/60';
      default:
        return 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/60';
    }
  };

  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            {t.recentBusinessActivity}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Immutable audit log of staff actions and manufacturing events
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {activities.slice(0, 5).map(act => (
          <div
            key={act.id}
            className="flex items-start justify-between gap-3 p-3 rounded-lg bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 text-xs"
          >
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white truncate">
                  {act.action}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.2 rounded ${getCategoryBadgeClass(
                    act.category
                  )}`}
                >
                  {act.category}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 truncate">
                {act.details}
              </p>
              <div className="text-[11px] text-slate-400 font-medium pt-0.5">
                By: {act.user}
              </div>
            </div>

            <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" /> {act.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
