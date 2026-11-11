import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  DollarSign,
  PackagePlus,
  Users,
  AlertTriangle,
  Receipt,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { formatIndianCurrency } from '../../data/sampleData';

export const SimpleDashboard: React.FC = () => {
  const { setActiveQuickAction, t, products } = useApp();

  const lowStockCount = products.filter(p => p.currentStock < p.minStockLevel).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Mode Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-amber-950 dark:text-amber-200">
            {t.simpleMode} (आसान मोड)
          </h2>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            बड़ी लिखावट, आसान बटन, केवल सबसे जरूरी काम और हिसाब।
          </p>
        </div>
      </div>

      {/* 4 Big Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Today's Sales */}
        <div className="p-6 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Receipt className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t.todaysSales} (आज की बिक्री)
            </div>
            <div className="text-3xl font-extrabold font-mono text-emerald-800 dark:text-emerald-300 tabular-nums">
              {formatIndianCurrency(485200)}
            </div>
            <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> 277 बोरी माल बिका
            </div>
          </div>
        </div>

        {/* Collections */}
        <div className="p-6 rounded-2xl border-2 border-teal-200 dark:border-teal-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center shrink-0">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t.todaysCollections} (आज की वसूली)
            </div>
            <div className="text-3xl font-extrabold font-mono text-teal-800 dark:text-teal-300 tabular-nums">
              {formatIndianCurrency(375000)}
            </div>
            <div className="text-xs font-semibold text-teal-600 mt-1">
              बैंक + यूपीआई + नकद
            </div>
          </div>
        </div>

        {/* Market Udhar / Receivables */}
        <div className="p-6 rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t.totalReceivables} (मार्केट उधारी)
            </div>
            <div className="text-3xl font-extrabold font-mono text-amber-800 dark:text-amber-300 tabular-nums">
              {formatIndianCurrency(3245800)}
            </div>
            <div className="text-xs font-semibold text-amber-600 mt-1">
              28 डीलरों से बकाया
            </div>
          </div>
        </div>

        {/* Factory Stock */}
        <div className="p-6 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 flex items-center justify-center shrink-0">
            <PackagePlus className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t.totalStockValue} (गोदाम में माल)
            </div>
            <div className="text-3xl font-extrabold font-mono text-indigo-800 dark:text-indigo-300 tabular-nums">
              {formatIndianCurrency(8460000)}
            </div>
            <div className="text-xs font-semibold text-indigo-600 mt-1">
              1,420 टन तैयार व कच्चा माल
            </div>
          </div>
        </div>
      </div>

      {/* Stock warning banner if any */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <div className="text-base font-bold text-rose-950 dark:text-rose-200">
                मक्का (Yellow Maize) व सोया डीओसी का स्टॉक कम है!
              </div>
              <div className="text-xs text-rose-700 dark:text-rose-300">
                फैक्ट्री के साइलो में न्यूनतम बफर से कम माल बचा है। तुरंत खरीद दर्ज करें।
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveQuickAction('add_purchase')}
            className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-sm shadow-sm"
          >
            कच्चा माल मंगाएं
          </button>
        </div>
      )}

      {/* 4 Big Action Touch Buttons */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
          त्वरित काम (Quick Actions)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setActiveQuickAction('create_sales_bill')}
            className="p-5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-4 text-left shadow-md transition-all active:scale-98"
          >
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">1. बिक्री बिल बनाएं (New Bill)</div>
              <div className="text-xs text-emerald-100">
                ग्राहक को नया चालान या टैक्स बिल काटें
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveQuickAction('receive_payment')}
            className="p-5 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white flex items-center gap-4 text-left shadow-md transition-all active:scale-98"
          >
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">2. पेमेंट जमा करें (Receive Payment)</div>
              <div className="text-xs text-teal-100">
                डीलर या डेयरी फार्म से रुपये खाते में जमा करें
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveQuickAction('add_stock')}
            className="p-5 rounded-2xl bg-indigo-800 hover:bg-indigo-900 text-white flex items-center gap-4 text-left shadow-md transition-all active:scale-98"
          >
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <PackagePlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">3. गोदाम में माल जोड़ें (Add Stock)</div>
              <div className="text-xs text-indigo-100">
                फैक्ट्री से तैयार बोरियां गोदाम में दर्ज करें
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveQuickAction('add_customer')}
            className="p-5 rounded-2xl bg-purple-800 hover:bg-purple-900 text-white flex items-center gap-4 text-left shadow-md transition-all active:scale-98"
          >
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">4. नया खाता खोलें (New Customer)</div>
              <div className="text-xs text-purple-100">
                नए डीलर या डेयरी वाले का नाम व पता जोड़ें
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
