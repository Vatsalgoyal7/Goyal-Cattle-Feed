import React, { useState } from 'react';
import {
  Bell, BellOff, CheckCircle2, XCircle, AlertTriangle, Info,
  Package, IndianRupee, Users, Factory, Truck, Calendar, Clock,
  Settings, Filter, Trash2, Eye, Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useEnterprise } from '../../context/EnterpriseContext';

const PREF_KEY = 'goyal_notification_prefs';

const DEFAULT_PREFS = {
  lowStock: true,
  paymentDue: true,
  production: true,
  attendance: false,
  aiReminders: true,
  system: true,
};

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  Sales: IndianRupee,
  Purchase: Package,
  Inventory: Package,
  HR: Users,
  Production: Factory,
  Transport: Truck,
  Accounts: IndianRupee,
  Operations: Settings,
  Quality: CheckCircle2,
  System: Bell,
};

const CATEGORY_COLORS: Record<string, string> = {
  Sales: 'emerald',
  Purchase: 'blue',
  Inventory: 'amber',
  HR: 'rose',
  Production: 'violet',
  Transport: 'cyan',
  Accounts: 'indigo',
  Operations: 'slate',
  Quality: 'teal',
  System: 'slate',
};

export const NotificationsPage: React.FC = () => {
  const { notifications, clearNotifications } = useApp();
  const { products, customers, tasks } = useEnterprise();
  const [filter, setFilter] = useState('All');
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [prefs, setPrefs] = useState(() => {
    try { return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREF_KEY) || '{}') }; }
    catch { return DEFAULT_PREFS; }
  });
  const [toast, setToast] = useState('');
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const savePrefs = (p: typeof prefs) => {
    setPrefs(p);
    localStorage.setItem(PREF_KEY, JSON.stringify(p));
    showToast('Notification preferences saved.');
  };

  const togglePref = (key: keyof typeof prefs) => savePrefs({ ...prefs, [key]: !prefs[key] });

  // Auto-generated business alerts
  const lowStockAlerts = products.filter(p => p.currentStock <= p.minimumStock);
  const overdueCustomers = customers.filter(c => c.paymentStatus === 'Overdue');
  const pendingTasks = tasks.filter(t => t.status === 'Pending' && t.priority === 'High');

  const FILTER_TABS = ['All', 'Business Alerts', 'AI Reminders', 'System'];
  const visibleNotifications = notifications.filter((_, idx) => !dismissed.has(idx));

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-20 right-4 z-50 bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs shadow-lg">{toast}</div>}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />Notifications
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Business alerts, AI reminders, and system notifications.
            {visibleNotifications.length > 0 && <span className="ml-1.5 font-bold text-indigo-700 dark:text-indigo-400">{visibleNotifications.length} unread</span>}
          </p>
        </div>
        {notifications.length > 0 && (
          <button onClick={() => { clearNotifications(); showToast('All notifications cleared.'); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />Clear All
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit flex-wrap">
        {FILTER_TABS.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>{f}</button>
        ))}
      </div>

      {/* Notification Feed */}
      <div className="space-y-2">
        {visibleNotifications.length === 0 && (
          <div className="text-center py-8">
            <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs text-slate-400">No notifications. All caught up! ✓</p>
          </div>
        )}
        {visibleNotifications.map((notif, idx) => {
          const Cat = CATEGORY_ICONS[notif.category] ?? Bell;
          const color = CATEGORY_COLORS[notif.category] ?? 'slate';
          return (
            <div key={idx} className={`flex items-start gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all`}>
              <div className={`w-8 h-8 rounded-xl bg-${color}-100 dark:bg-${color}-950/50 flex items-center justify-center shrink-0`}>
                <Cat className={`w-4 h-4 text-${color}-700 dark:text-${color}-400`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{notif.action}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notif.detail}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-${color}-100 dark:bg-${color}-950/50 text-${color}-700 dark:text-${color}-400`}>{notif.category}</span>
                </div>
              </div>
              <button onClick={() => setDismissed(prev => new Set([...prev, idx]))} className="text-slate-300 hover:text-slate-500 dark:hover:text-slate-200 transition-colors p-0.5 shrink-0">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Auto-Generated Business Alerts */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Live Business Alerts</h2>

        {lowStockAlerts.length > 0 && prefs.lowStock && (
          <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">Low Stock Alert – {lowStockAlerts.length} Products</span>
            </div>
            <div className="space-y-1">
              {lowStockAlerts.slice(0, 4).map(p => (
                <div key={p.id} className="flex justify-between text-[11px]">
                  <span className="text-amber-800 dark:text-amber-200">{p.name}</span>
                  <span className="font-semibold text-amber-900 dark:text-amber-100">{p.currentStock} {p.unit} remaining</span>
                </div>
              ))}
              {lowStockAlerts.length > 4 && <p className="text-[10px] text-amber-600">+{lowStockAlerts.length - 4} more items</p>}
            </div>
          </div>
        )}

        {overdueCustomers.length > 0 && prefs.paymentDue && (
          <div className="p-4 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="w-4 h-4 text-red-700" />
              <span className="text-xs font-bold text-red-800 dark:text-red-300">Overdue Payments – {overdueCustomers.length} Accounts</span>
            </div>
            {overdueCustomers.slice(0, 3).map(c => (
              <div key={c.id} className="flex justify-between text-[11px] mt-1">
                <span className="text-red-800 dark:text-red-200">{c.firmName}</span>
                <span className="font-bold text-red-900 dark:text-red-100">₹{c.currentOutstanding.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        )}

        {pendingTasks.length > 0 && prefs.aiReminders && (
          <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-700" />
              <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">AI Reminders – {pendingTasks.length} High-Priority Tasks</span>
            </div>
            {pendingTasks.slice(0, 3).map(t => (
              <div key={t.id} className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-1">• {t.title}</div>
            ))}
          </div>
        )}

        {lowStockAlerts.length === 0 && overdueCustomers.length === 0 && pendingTasks.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-1" />
            All business metrics are healthy! 🎉
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3">
        <h2 className="text-xs font-bold text-slate-700 dark:text-slate-200">Notification Preferences</h2>
        <div className="space-y-2.5">
          {[
            { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Alert when product stock falls below safety buffer' },
            { key: 'paymentDue', label: 'Payment Due Alerts', desc: 'Alert for overdue customer payments' },
            { key: 'production', label: 'Production Updates', desc: 'Production order completions and batch alerts' },
            { key: 'attendance', label: 'Employee Attendance', desc: 'Daily attendance summary and absenteeism alerts' },
            { key: 'aiReminders', label: 'AI Reminders', desc: 'Task reminders set by Goyal AI Partner' },
            { key: 'system', label: 'System Notifications', desc: 'Backups, sync, and system events' },
          ].map(pref => (
            <div key={pref.key} className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{pref.label}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{pref.desc}</p>
              </div>
              <button
                onClick={() => togglePref(pref.key as keyof typeof prefs)}
                className={`w-10 h-5 rounded-full transition-colors relative shrink-0 mt-0.5 ${prefs[pref.key as keyof typeof prefs] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${prefs[pref.key as keyof typeof prefs] ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
