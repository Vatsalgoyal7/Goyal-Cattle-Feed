import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Receipt,
  Package,
  Users,
  CreditCard,
  Wallet,
  PiggyBank,
  CheckCircle2,
} from 'lucide-react';
import { formatIndianCurrency } from '../../data/sampleData';

export const MetricCardsGrid: React.FC = () => {
  const { t, selectedDateRange } = useApp();

  // Metrics data - dynamically adapted if date range changes
  const getMultiplier = () => {
    switch (selectedDateRange) {
      case 'yesterday':
        return 0.92;
      case 'week':
        return 5.8;
      case 'month':
        return 24.5;
      case 'last_month':
        return 26.0;
      default:
        return 1.0;
    }
  };

  const mult = getMultiplier();

  const metrics = [
    {
      title: t.todaysSales,
      amount: 485200 * mult,
      trend: '+12.4%',
      isPositive: true,
      subtitle: t.vsYesterday,
      icon: Receipt,
      iconBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
    },
    {
      title: t.todaysPurchases,
      amount: 318450 * mult,
      trend: '-4.1%',
      isPositive: true,
      subtitle: 'raw grain & meal procurement',
      icon: ShoppingCart,
      iconBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
    },
    {
      title: t.totalStockValue,
      amount: 8460000,
      trend: '+2.8%',
      isPositive: true,
      subtitle: t.finishedRawStock,
      icon: Package,
      iconBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400',
    },
    {
      title: t.totalReceivables,
      amount: 3245800,
      trend: '-8.5%',
      isPositive: true,
      subtitle: 'due from 28 feed dealers',
      icon: Users,
      iconBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
    },
    {
      title: t.totalPayables,
      amount: 1892300,
      trend: '+1.2%',
      isPositive: false,
      subtitle: 'due to 14 raw suppliers',
      icon: CreditCard,
      iconBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
    },
    {
      title: t.todaysCollections,
      amount: 375000 * mult,
      trend: '+18.2%',
      isPositive: true,
      subtitle: 'UPI, NEFT & cash realized',
      icon: Wallet,
      iconBg: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400',
    },
    {
      title: t.todaysExpenses,
      amount: 42600 * mult,
      trend: '-2.4%',
      isPositive: true,
      subtitle: 'power, diesel, factory wages',
      icon: PiggyBank,
      iconBg: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400',
    },
    {
      title: t.estimatedProfit,
      amount: 64150 * mult,
      trend: '+14.6%',
      isPositive: true,
      subtitle: t.netMargin,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((card, idx) => {
        const IconComp = card.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            {/* Top row */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg ${card.iconBg} shrink-0`}>
                <IconComp className="w-4 h-4" />
              </div>
            </div>

            {/* Main figure */}
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums my-1">
              {formatIndianCurrency(card.amount)}
            </div>

            {/* Bottom trend & subtitle */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-1 font-semibold">
                {card.isPositive ? (
                  <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> {card.trend}
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" /> {card.trend}
                  </span>
                )}
              </div>
              <span className="text-slate-400 dark:text-slate-500 truncate text-[11px] ml-2">
                {card.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
