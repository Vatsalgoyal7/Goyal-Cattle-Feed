import React, { useState } from 'react';
import {
  Shield, Eye, Clock, User, Filter, Download, Search,
  CheckCircle2, AlertTriangle, Zap, Brain, Bell, Package,
  IndianRupee, FileText, Users, Factory, XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useEnterprise } from '../../context/EnterpriseContext';

const TABS = ['Business Activity Log', 'AI Action Audit'] as const;
type TabType = typeof TABS[number];

const ACTION_ICONS: Record<string, React.ComponentType<any>> = {
  'Stock In': Package,
  'Remember Memory': Brain,
  'Schedule Reminder': Bell,
  'Sales': IndianRupee,
  'Purchase': FileText,
  'HR': Users,
  'Production': Factory,
};

function downloadCSV(data: Record<string, any>[], filename: string) {
  if (!data.length) return;
  const cols = Object.keys(data[0]);
  const rows = [cols.join(','), ...data.map(r => cols.map(c => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(','))];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

export const AuditTrailPage: React.FC = () => {
  const { activities } = useApp();
  const { aiAuditLogs } = useEnterprise();
  const [activeTab, setActiveTab] = useState<TabType>('Business Activity Log');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [toast, setToast] = useState('');
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const categories = ['All', ...Array.from(new Set(activities.map(a => a.category)))];

  const filteredActivities = activities.filter(a =>
    (categoryFilter === 'All' || a.category === categoryFilter) &&
    (a.action.toLowerCase().includes(search.toLowerCase()) || a.detail.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredAILogs = aiAuditLogs.filter(l =>
    l.actionType.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  );

  const today = new Date().toLocaleDateString('en-GB');
  const todayActivities = activities.filter(a => a.timestamp?.startsWith(today) || a.timestamp?.includes(new Date().getFullYear().toString())).length;

  const stats = [
    { label: 'Total Activities', value: activities.length, color: 'indigo' },
    { label: "Today's Activities", value: todayActivities, color: 'emerald' },
    { label: 'AI Actions', value: aiAuditLogs.length, color: 'purple' },
    { label: 'Failed Actions', value: aiAuditLogs.filter(l => l.status === 'Failed').length, color: 'red' },
  ];

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-20 right-4 z-50 bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs shadow-lg">{toast}</div>}

      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />Audit Trail
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Complete immutable log of all business and AI actions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className={`p-3 rounded-xl border border-${s.color}-200 dark:border-${s.color}-800 bg-${s.color}-50 dark:bg-${s.color}-950/30`}>
            <p className={`text-2xl font-bold text-${s.color}-800 dark:text-${s.color}-300`}>{s.value}</p>
            <p className={`text-[11px] text-${s.color}-700 dark:text-${s.color}-400`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>{tab}</button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activities..." className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        {activeTab === 'Business Activity Log' && (
          <div className="flex gap-1 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${categoryFilter === cat ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>{cat}</button>
            ))}
          </div>
        )}
        <button
          onClick={() => {
            if (activeTab === 'Business Activity Log') {
              downloadCSV(filteredActivities.map(a => ({ Timestamp: a.timestamp, Action: a.action, Detail: a.detail, Category: a.category })), 'activity_log.csv');
            } else {
              downloadCSV(filteredAILogs.map(l => ({ Timestamp: l.timestamp, ActionType: l.actionType, PerformedBy: l.performedBy, Details: l.details, RecordId: l.recordId || '', Status: l.status })), 'ai_audit_log.csv');
            }
            showToast('CSV exported.');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />Export CSV
        </button>
      </div>

      {/* Activity Log Tab */}
      {activeTab === 'Business Activity Log' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 shadow-xs">
          <div className="hidden md:grid grid-cols-[auto_2fr_3fr_1fr] px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
            <span className="w-20">Time</span><span>Action</span><span>Details</span><span>Category</span>
          </div>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">No activities match your search.</div>
          ) : (
            filteredActivities.map((a, idx) => {
              const Cat = ACTION_ICONS[a.category] ?? Shield;
              const catColor = { Sales: 'emerald', Purchase: 'blue', Inventory: 'amber', HR: 'rose', Production: 'violet', Transport: 'cyan', Accounts: 'indigo' }[a.category] ?? 'slate';
              return (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-[auto_2fr_3fr_1fr] items-start px-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 gap-y-1 md:gap-0">
                  <div className="w-20 flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span className="truncate">{a.timestamp?.split(' ').pop() ?? '—'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
                    <Cat className={`w-3.5 h-3.5 text-${catColor}-600 shrink-0`} />
                    {a.action}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate md:pl-2">{a.detail}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-${catColor}-100 dark:bg-${catColor}-950/50 text-${catColor}-700 dark:text-${catColor}-400 w-fit`}>{a.category}</span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* AI Audit Tab */}
      {activeTab === 'AI Action Audit' && (
        <div className="space-y-3">
          {filteredAILogs.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              <Shield className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No AI actions logged yet. Start using Goyal AI Partner to see entries.
            </div>
          ) : (
            filteredAILogs.map(log => {
              const ActionIcon = ACTION_ICONS[log.actionType] ?? Zap;
              const isSuccess = log.status === 'Success';
              return (
                <div key={log.id} className={`p-4 rounded-2xl border ${isSuccess ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20' : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl ${isSuccess ? 'bg-emerald-100 dark:bg-emerald-950/50' : 'bg-red-100 dark:bg-red-950/50'} flex items-center justify-center`}>
                        <ActionIcon className={`w-4 h-4 ${isSuccess ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600'}`} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{log.actionType}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{log.performedBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSuccess ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                        {isSuccess ? '✓ ' : '✗ '}{log.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-2">{log.details}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span><Clock className="w-3 h-3 inline mr-1" />{log.timestamp}</span>
                    {log.recordId && <span className="font-mono text-indigo-600 dark:text-indigo-400">Ref: {log.recordId}</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
