import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuickActionsBar } from '../dashboard/QuickActionsBar';
import { MetricCardsGrid } from '../dashboard/MetricCardsGrid';
import { SalesPurchaseChart } from '../dashboard/SalesPurchaseChart';
import { RevenueChart } from '../dashboard/RevenueChart';
import { ExpenseBreakdown } from '../dashboard/ExpenseBreakdown';
import { TopSellingProducts } from '../dashboard/TopSellingProducts';
import { TopCustomers } from '../dashboard/TopCustomers';
import { WarehouseSummary } from '../dashboard/WarehouseSummary';
import { RecentTransactionsTable } from '../dashboard/RecentTransactionsTable';
import { PendingPaymentsTable } from '../dashboard/PendingPaymentsTable';
import { RecentActivityFeed } from '../dashboard/RecentActivityFeed';
import { LowStockAlerts } from '../dashboard/LowStockAlerts';
import { SimpleDashboard } from '../dashboard/SimpleDashboard';
import { BRANCHES } from '../../data/sampleData';
import { DateRange, BranchLocation } from '../../types';
import {
  Calendar,
  Building,
  Sparkles,
  Download,
  Filter,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    t,
    userProfile,
    companyProfile,
    selectedBranch,
    setSelectedBranch,
    selectedDateRange,
    setSelectedDateRange,
    displayMode,
  } = useApp();

  const [isExporting, setIsExporting] = useState(false);

  // Dynamic greeting based on current local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.greetingMorning;
    if (hour < 17) return t.greetingAfternoon;
    return t.greetingEvening;
  };

  const currentDateFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const dateFilters: { id: DateRange; label: string }[] = [
    { id: 'today', label: t.today },
    { id: 'yesterday', label: t.yesterday },
    { id: 'week', label: t.thisWeek },
    { id: 'month', label: t.thisMonth },
    { id: 'last_month', label: t.lastMonth },
    { id: 'custom', label: t.customDate },
  ];

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Simulated CSV download feedback
      const dummyCsv = 'Goyal Cattle Feed - Daily Business OS Report\nGenerated: 11/11/2026';
      const blob = new Blob([dummyCsv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Goyal_Feed_Report_${selectedDateRange}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <img
            src="/images/goyal_shop_real.png"
            alt="Goyal Cattle Feed Store"
            className="w-14 h-14 rounded-xl object-cover ring-2 ring-emerald-600/30 shadow-xs hidden sm:block shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-0.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{companyProfile.companyName}</span>
              <span>·</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-medium">
                {companyProfile.tagline}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{getGreeting()}, {userProfile.fullName.split(' ')[0]}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Live Store
              </span>
            </h1>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Today is <strong className="text-slate-700 dark:text-slate-300">{currentDateFormatted}</strong> · Gajraula Store & Godowns Active
            </p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Branch / Warehouse selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs shadow-2xs">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value as BranchLocation)}
              aria-label="Select Branch or Location"
              className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold outline-none cursor-pointer"
            >
              {BRANCHES.map(b => (
                <option key={b.id} value={b.id} className="dark:bg-slate-900">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Export Report button */}
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-2xs transition-colors"
            title="Download Excel / CSV Summary"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export Ledger'}</span>
          </button>
        </div>
      </div>

      {/* Date Range Filter Bar */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-xl text-xs font-medium shrink-0">
          <Calendar className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
          {dateFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedDateRange(filter.id)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                selectedDateRange === filter.id
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Real-time feeds updating every 60s</span>
        </div>
      </div>

      {/* RENDER SIMPLE OR ADVANCED MODE */}
      {displayMode === 'simple' ? (
        <SimpleDashboard />
      ) : (
        <div className="space-y-6">
          {/* Quick Actions Bar */}
          <section aria-label="Quick Actions">
            <QuickActionsBar />
          </section>

          {/* 8 Business Summary Cards */}
          <section aria-label="Business Metrics">
            <MetricCardsGrid />
          </section>

          {/* Analytics Charts Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Analytics Charts">
            <div className="lg:col-span-2">
              <SalesPurchaseChart />
            </div>
            <div className="lg:col-span-1">
              <RevenueChart />
            </div>
          </section>

          {/* Expense Breakdown & Top Products Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ExpenseBreakdown />
            </div>
            <div className="lg:col-span-2">
              <TopSellingProducts />
            </div>
          </section>

          {/* Top Customers & Warehouse Summary Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopCustomers />
            <WarehouseSummary />
          </section>

          {/* Transactions & Pending Payments Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentTransactionsTable />
            <PendingPaymentsTable />
          </section>

          {/* Recent Activity Feed & Low Stock Alerts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivityFeed />
            <LowStockAlerts />
          </section>
        </div>
      )}
    </div>
  );
};
