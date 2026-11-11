import React from 'react';
import { EXPENSE_CATEGORIES, formatIndianCurrency } from '../../data/sampleData';
import { useApp } from '../../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const ExpenseBreakdown: React.FC = () => {
  const { t } = useApp();

  const totalExpense = EXPENSE_CATEGORIES.reduce((acc, curr) => acc + curr.amount, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl text-xs">
          <div className="font-bold text-slate-900 dark:text-white">{data.name}</div>
          <div className="font-mono text-emerald-700 dark:text-emerald-400 font-bold tabular-nums">
            {formatIndianCurrency(data.amount)} ({data.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.expenseBreakdown}
          </h3>
          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white tabular-nums">
            Total: {formatIndianCurrency(totalExpense)}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Today's operational and milling overhead distribution
        </p>

        {/* Donut chart */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={EXPENSE_CATEGORIES}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="amount"
              >
                {EXPENSE_CATEGORIES.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Bars / Breakdown */}
      <div className="space-y-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        {EXPENSE_CATEGORIES.map(cat => (
          <div key={cat.name} className="text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-600 dark:text-slate-400 truncate max-w-[170px]">
                {cat.name}
              </span>
              <span className="font-mono font-medium text-slate-900 dark:text-white tabular-nums">
                {formatIndianCurrency(cat.amount)} ({cat.percentage}%)
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
