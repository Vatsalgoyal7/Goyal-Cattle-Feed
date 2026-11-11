import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Coffee,
  Globe,
  Bell,
  Shield,
  Sliders,
  Info,
  CheckCircle,
  RotateCcw,
  User,
  Building,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { AppTheme, AppLanguage, FontSize, AccentColor, UserRole } from '../../types';

export const SettingsPage: React.FC = () => {
  const {
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    fontSize,
    setFontSize,
    language,
    setLanguage,
    displayMode,
    setDisplayMode,
    activeRole,
    setActiveRole,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'appearance' | 'language' | 'general' | 'notifications' | 'preferences' | 'security' | 'info'
  >('appearance');

  const [saveToast, setSaveToast] = useState(false);

  // Settings toggles
  const [enableSound, setEnableSound] = useState(true);
  const [enableDesktopNotifs, setEnableDesktopNotifs] = useState(true);
  const [enableAutoBackup, setEnableAutoBackup] = useState(true);
  const [financialYear, setFinancialYear] = useState('2026-2027');
  const [currencySymbol, setCurrencySymbol] = useState('₹ (INR)');
  const [invoicePrefix, setInvoicePrefix] = useState('INV/2026/');

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const rolesList: UserRole[] = [
    'Owner / Super Admin',
    'Manager',
    'Accountant',
    'Stock Manager',
    'Sales Executive',
    'Purchase Manager',
    'HR Manager',
    'Transport Manager',
    'Production Manager',
    'Viewer',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-emerald-800 dark:text-emerald-400" />
            <span>ERP System Settings</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure enterprise preferences, visual design tokens, language, and role permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/profile"
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <User className="w-3.5 h-3.5" /> My Profile
          </NavLink>
          <NavLink
            to="/company-profile"
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Building className="w-3.5 h-3.5" /> Company Profile
          </NavLink>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">Preferences saved and applied instantly across Goyal Business OS.</span>
        </div>
      )}

      {/* Settings Layout with Horizontal/Vertical Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs List */}
        <div className="space-y-1">
          {[
            { id: 'appearance', label: 'Appearance & Theme', icon: Sun },
            { id: 'language', label: 'Language & Locale', icon: Globe },
            { id: 'general', label: 'General & Financial', icon: Sliders },
            { id: 'notifications', label: 'Notification Rules', icon: Bell },
            { id: 'preferences', label: 'Roles & Mode', icon: Shield },
            { id: 'security', label: 'Security & Auth', icon: Shield },
            { id: 'info', label: 'App Information', icon: Info },
          ].map(tab => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900'
                }`}
              >
                <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-3 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-6">
          {/* 1. APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Visual Design & Theme System
                </h3>
                <p className="text-xs text-slate-500">
                  Select interface theme, accent tone, and base typography scale
                </p>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Display Mode Theme
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Light */}
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      theme === 'light'
                        ? 'border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Sun className="w-5 h-5 text-amber-500" />
                      {theme === 'light' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Light Mode</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Crisp, high-contrast daylight view for office desktops
                    </p>
                  </button>

                  {/* Dark */}
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      theme === 'dark'
                        ? 'border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Moon className="w-5 h-5 text-indigo-400" />
                      {theme === 'dark' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Low-glare slate palette designed for low-light plant floors
                    </p>
                  </button>

                  {/* Eye Comfort */}
                  <button
                    onClick={() => setTheme('comfort')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      theme === 'comfort'
                        ? 'border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Coffee className="w-5 h-5 text-amber-600" />
                      {theme === 'comfort' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Eye Comfort Mode</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Warm cream background, soft contrast for prolonged hours
                    </p>
                  </button>
                </div>
              </div>

              {/* Accent Color Customization */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Accent Color Theme
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'emerald', label: 'Forest Emerald (Agri Brand)', color: 'bg-emerald-800' },
                    { id: 'blue', label: 'Industrial Blue', color: 'bg-blue-700' },
                    { id: 'amber', label: 'Harvest Amber', color: 'bg-amber-600' },
                    { id: 'slate', label: 'Corporate Slate', color: 'bg-slate-700' },
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => setAccentColor(c.id as AccentColor)}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all ${
                        accentColor === c.id
                          ? 'border-slate-900 dark:border-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${c.color}`} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Adjustment */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Font Size Scaling
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'small', label: 'Small (14px)', desc: 'High density ERP tables' },
                    { id: 'normal', label: 'Standard (16px)', desc: 'Balanced default scale' },
                    { id: 'large', label: 'Large (17px+)', desc: 'Comfortable factory readability' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFontSize(f.id as FontSize)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        fontSize === f.id
                          ? 'border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{f.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. LANGUAGE */}
          {activeTab === 'language' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Multi-Language & Localization
                </h3>
                <p className="text-xs text-slate-500">
                  Switch the entire ERP language across navigation, dashboard, vouchers, and reports
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'en',
                    nativeName: 'English (International Business)',
                    desc: 'Standard commercial terminology used in statutory and tax filings',
                  },
                  {
                    id: 'hi',
                    nativeName: 'हिन्दी (Devanagari)',
                    desc: 'पूर्ण रूप से हिन्दी अनुवादित इंटरफ़ेस (बिक्री, खरीद, स्टॉक एवं खाता)',
                  },
                  {
                    id: 'hinglish',
                    nativeName: 'Hinglish (Roman Hindi)',
                    desc: 'Aasan bole-jaane wali Hindi vyapar bhasha (Bikri, Godown, Kharcha hisab)',
                  },
                ].map(lang => (
                  <div
                    key={lang.id}
                    onClick={() => setLanguage(lang.id as AppLanguage)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      language === lang.id
                        ? 'border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {lang.nativeName}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{lang.desc}</div>
                    </div>
                    {language === lang.id && <CheckCircle className="w-5 h-5 text-emerald-700" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  General ERP & Financial Settings
                </h3>
                <p className="text-xs text-slate-500">
                  Configure default fiscal year, invoice numbering series, and currency formats
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Current Financial Year
                  </label>
                  <input
                    type="text"
                    value={financialYear}
                    onChange={e => setFinancialYear(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Currency Symbol & Format
                  </label>
                  <input
                    type="text"
                    value={currencySymbol}
                    onChange={e => setCurrencySymbol(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Sales Tax Invoice Numbering Series
                  </label>
                  <input
                    type="text"
                    value={invoicePrefix}
                    onChange={e => setInvoicePrefix(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Date Display Format
                  </label>
                  <input
                    type="text"
                    value="DD/MM/YYYY (Indian Standard)"
                    disabled
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs"
                >
                  Save General Settings
                </button>
              </div>
            </div>
          )}

          {/* 4. NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Notification & Communication Rules
                </h3>
                <p className="text-xs text-slate-500">
                  Control real-time push alerts, SMS notifications, and WhatsApp ledger dispatches
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'WhatsApp Invoice & Receipt Sharing',
                    desc: 'Automatically generate and send PDF bill link to customer mobile upon saving invoice.',
                    state: enableDesktopNotifs,
                    setter: setEnableDesktopNotifs,
                  },
                  {
                    title: 'Low Stock Sound & Push Alerts',
                    desc: 'Alert factory manager instantly when raw maize or soybean drops below minimum buffer.',
                    state: enableSound,
                    setter: setEnableSound,
                  },
                  {
                    title: 'Automated Daily Financial Closing Summary',
                    desc: 'Send end-of-day sales, collections, and outstanding Khata report to owner email.',
                    state: enableAutoBackup,
                    setter: setEnableAutoBackup,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs"
                  >
                    <div className="space-y-0.5 pr-4">
                      <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                      <div className="text-slate-500">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => item.setter(!item.state)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors shrink-0 ${
                        item.state
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.state ? 'Active' : 'Off'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. PREFERENCES & ROLES */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Interface Mode & Role Switcher (Demo)
                </h3>
                <p className="text-xs text-slate-500">
                  Toggle between Simple Mode (elderly/touch) and Advanced ERP Mode, or simulate staff roles
                </p>
              </div>

              {/* Simple vs Advanced mode switch */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    Active Interface Layout Mode
                  </div>
                  <div className="flex gap-1 p-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                    <button
                      onClick={() => setDisplayMode('advanced')}
                      className={`px-3 py-1 rounded font-semibold transition-colors ${
                        displayMode === 'advanced'
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Advanced ERP
                    </button>
                    <button
                      onClick={() => setDisplayMode('simple')}
                      className={`px-3 py-1 rounded font-semibold transition-colors ${
                        displayMode === 'simple'
                          ? 'bg-amber-600 text-white'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Simple Touch Mode
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Simple mode presents high-contrast oversized cards and simplified language designed for non-technical users and shop floor tablets. Changing modes never alters underlying data.
                </p>
              </div>

              {/* Role Switcher */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Select Demo Operating Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {rolesList.map(r => (
                    <button
                      key={r}
                      onClick={() => setActiveRole(r)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                        activeRole === r
                          ? 'border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Security & Server Integration Readiness
                </h3>
                <p className="text-xs text-slate-500">
                  Architectural compliance with Supabase PostgreSQL, R2 Storage, and IndexedDB
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1">
                  <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Cloud Sync Architecture Ready
                  </div>
                  <p className="text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                    Local state is fully decoupled and ready for drop-in connector with Supabase Authentication, PostgreSQL RLS tables, and Cloudflare R2 bucket for invoice PDFs and weighing scale snapshots.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    Offline IndexedDB Storage Buffer
                  </div>
                  <p className="text-slate-500 leading-relaxed">
                    Designed for rural plant connectivity failures. Bills can be recorded locally in offline queue and synchronized when connection is restored.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 7. APP INFO */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Application Information
                </h3>
                <p className="text-xs text-slate-500">
                  Technical specifications, build metadata, and copyright
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Application:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Goyal Business OS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Enterprise:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Goyal Cattle Feed Pvt. Ltd.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Version:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">v1.0.4-Enterprise (Part 1 Foundation)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Framework Stack:</span>
                  <span className="text-slate-700 dark:text-slate-300">React 19 + TypeScript + Vite + Tailwind v4 + Recharts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Build Timestamp:</span>
                  <span className="text-slate-700 dark:text-slate-300">11 Nov 2026, 08:30 IST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">License:</span>
                  <span className="text-slate-700 dark:text-slate-300">Proprietary Commercial ERP</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
