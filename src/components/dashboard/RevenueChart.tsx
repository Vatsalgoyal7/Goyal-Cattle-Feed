import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  SALES_PURCHASE_DATA_MONTHLY,
  formatCompactNumber,
} from '../../data/sampleData';
import { useApp } from '../../context/AppContext';
import { TrendingUp } from 'lucide-react';

export const RevenueChart: React.FC = () => {
  const { t } = useApp();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl text-xs">
          <div className="font-bold text-slate-900 dark:text-white mb-1">{label}</div>
          <div className="flex justify-between gap-4 py-0.5">
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Monthly Revenue:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              ₹{payload[0].value.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.revenueOverview}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            6-Month consolidated revenue trajectory across all plants
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
          <TrendingUp className="w-3.5 h-3.5" /> +40.4% H2 Growth
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={SALES_PURCHASE_DATA_MONTHLY}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#047857" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#047857" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={value => formatCompactNumber(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              name="Gross Turnover"
              stroke="#047857"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
