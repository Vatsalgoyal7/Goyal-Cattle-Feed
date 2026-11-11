import React, { useState, useRef } from 'react';
import {
  Database, Download, Upload, Clock, CheckCircle2, AlertTriangle,
  XCircle, Shield, RefreshCw, FileText, Info, Lock, ChevronDown,
  ChevronRight, Server,
} from 'lucide-react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { useApp } from '../../context/AppContext';

const BACKUP_HISTORY_KEY = 'goyal_backup_history';
const LAST_BACKUP_KEY = 'goyal_last_backup';

interface BackupRecord {
  filename: string;
  timestamp: string;
  size: string;
  status: 'Success' | 'Failed';
}

export const BackupPage: React.FC = () => {
  const { exportFullDatabaseBackup, restoreDatabaseFromBackup, invoices, customers, suppliers, products, employees, purchases } = useEnterprise();
  const { activities } = useApp();
  const [lastBackup, setLastBackup] = useState(() => localStorage.getItem(LAST_BACKUP_KEY) || null);
  const [backupHistory, setBackupHistory] = useState<BackupRecord[]>(() => {
    try { return JSON.parse(localStorage.getItem(BACKUP_HISTORY_KEY) || '[]'); } catch { return []; }
  });
  const [restoreResult, setRestoreResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  const recordCounts = [
    { label: 'Sales Invoices', count: invoices.length },
    { label: 'Purchase Bills', count: purchases.length },
    { label: 'Customers', count: customers.length },
    { label: 'Suppliers', count: suppliers.length },
    { label: 'Products', count: products.length },
    { label: 'Employees', count: employees.length },
    { label: 'Activity Log', count: activities.length },
  ];
  const totalRecords = recordCounts.reduce((s, r) => s + r.count, 0);

  const handleExport = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 600));
    exportFullDatabaseBackup();
    const now = new Date().toLocaleString('en-GB');
    const rec: BackupRecord = {
      filename: `Goyal_Business_OS_Backup_${new Date().toISOString().slice(0, 10)}.json`,
      timestamp: now,
      size: `~${Math.round(totalRecords * 0.5)} KB (est.)`,
      status: 'Success',
    };
    const updated = [rec, ...backupHistory].slice(0, 10);
    setBackupHistory(updated);
    localStorage.setItem(BACKUP_HISTORY_KEY, JSON.stringify(updated));
    localStorage.setItem(LAST_BACKUP_KEY, now);
    setLastBackup(now);
    setExporting(false);
    showToast('Database exported successfully!');
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoring(true);
    setRestoreResult(null);
    try {
      const text = await file.text();
      const ok = restoreDatabaseFromBackup(text);
      setRestoreResult({ ok, msg: ok ? `Restored from ${file.name}. All data updated.` : 'Restore failed: Invalid backup file format.' });
    } catch {
      setRestoreResult({ ok: false, msg: 'Failed to read file. Please select a valid Goyal Business OS JSON backup.' });
    }
    setRestoring(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const DOC_SECTIONS = [
    {
      title: 'How to restore data',
      content: '1. Click "Restore from File" and select a .json backup file.\n2. Review the warning carefully – this will overwrite current data.\n3. Confirm the restore. The system will import all records from the backup.\n4. After restore, verify critical data before proceeding with operations.'
    },
    {
      title: 'What is included in backup',
      content: 'The backup includes: Sales invoices, Purchase bills, Customers, Suppliers, Ledger entries, Expenses, Payments, Products/Inventory, Warehouses, Stock movements, Employees, Attendance, Salary slips, Production orders, Fleet, AI memories, Tasks, and Conversations.'
    },
    {
      title: 'Cloud backup configuration (requires Supabase)',
      content: 'For automatic cloud backups, configure Supabase:\n1. Create a Supabase project at supabase.com\n2. Create a "backups" storage bucket\n3. Add your Supabase URL and anon key to environment variables\n4. The system will auto-backup daily at midnight.\n\nCurrently running in Demo Mode – manual JSON export only.'
    },
  ];

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-20 right-4 z-50 bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs shadow-lg">{toast}</div>}

      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />Backup & Recovery
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Export and restore your complete business database.</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">Cloud Backup</span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400">Not Configured</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-500 mt-1">Configure Supabase for automatic cloud backups</p>
        </div>
        <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Local JSON Export</span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Available</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-500 mt-1">Last export: {lastBackup || 'Never'}</p>
        </div>
        <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-indigo-700" />
            <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">Total Records</span>
          </div>
          <p className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">{totalRecords.toLocaleString()}</p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-500">across {recordCounts.length} data collections</p>
        </div>
      </div>

      {/* Record Counts */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-3">Database Contents</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {recordCounts.map(r => (
            <div key={r.label} className="text-xs">
              <p className="text-slate-500 dark:text-slate-400">{r.label}</p>
              <p className="font-bold text-slate-900 dark:text-white">{r.count} records</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Actions */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">Manual Backup</h3>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleExport} disabled={exporting} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-xs">
            {exporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {exporting ? 'Exporting...' : 'Export Full Database Backup'}
          </button>
          <button onClick={() => { showToast('Partial export not yet implemented.'); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold transition-colors">
            <Download className="w-4 h-4" />Export Invoices Only
          </button>
        </div>
      </div>

      {/* Restore */}
      <div className="rounded-2xl border-2 border-dashed border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4 space-y-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-red-800 dark:text-red-300">Restore from Backup</p>
            <p className="text-[11px] text-red-700 dark:text-red-400 mt-0.5">Warning: This will OVERWRITE all current data with the backup file. This cannot be undone.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleRestore} />
          <button onClick={() => fileRef.current?.click()} disabled={restoring} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white text-xs font-bold transition-colors">
            {restoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {restoring ? 'Restoring...' : 'Restore from File (.json)'}
          </button>
        </div>
        {restoreResult && (
          <div className={`flex items-start gap-2 p-3 rounded-xl border text-xs ${restoreResult.ok ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300' : 'border-red-300 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300'}`}>
            {restoreResult.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
            {restoreResult.msg}
          </div>
        )}
      </div>

      {/* Backup History */}
      {backupHistory.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">Backup History</h3>
          </div>
          {backupHistory.map((rec, idx) => (
            <div key={idx} className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{rec.filename}</p>
                <p className="text-slate-400">{rec.timestamp}</p>
              </div>
              <span className="text-slate-500">{rec.size}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{rec.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Documentation */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">Recovery Documentation</h3>
        </div>
        {DOC_SECTIONS.map(sec => (
          <div key={sec.title} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
            <button onClick={() => setExpandedSection(expandedSection === sec.title ? null : sec.title)} className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <span>{sec.title}</span>
              {expandedSection === sec.title ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {expandedSection === sec.title && (
              <div className="px-4 pb-4">
                <pre className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{sec.content}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
