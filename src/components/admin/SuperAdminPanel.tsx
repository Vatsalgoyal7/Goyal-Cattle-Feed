import React, { useState, useEffect, useRef } from 'react';
import { useAuth, AppUser, UserRole, DEFAULT_COMPANY, CompanyProfile } from '../../context/AuthContext';
import { useEnterprise } from '../../context/EnterpriseContext';
import {
  Shield, Users, Building2, Settings, ChevronDown,
  Edit3, Save, X, Trash2, UserCheck, UserX,
  Plus, AlertCircle, CheckCircle, Loader2, LogOut,
  Phone, Mail, MapPin, Globe, CreditCard, Wheat,
  BarChart3, Package, Lock, Eye, EyeOff, RefreshCw,
  Camera, Upload, Sliders, QrCode, FileText, Database,
  Download, FileSpreadsheet, RotateCcw, Check, ArrowRight
} from 'lucide-react';
import { getUpiQrCodeUrl } from '../../utils/upiUtils';

type AdminTab =
  | 'approvals'
  | 'permissions'
  | 'about_editor'
  | 'payment_settings'
  | 'backup_reset'
  | 'users'
  | 'company'
  | 'settings';

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin:     'Super Admin',
  owner:           'Owner / Maalik',
  manager:         'Manager / Munim',
  accountant:      'Accountant',
  stock_manager:   'Stock Manager / Labour',
  sales_executive: 'Sales Executive (Billing)',
  hr_manager:      'Transport / Driver',
};

const ROLE_COLORS: Record<UserRole, string> = {
  super_admin:     'bg-red-100    text-red-800    border-red-200',
  owner:           'bg-purple-100 text-purple-800 border-purple-200',
  manager:         'bg-blue-100   text-blue-800   border-blue-200',
  accountant:      'bg-green-100  text-green-800  border-green-200',
  stock_manager:   'bg-amber-100  text-amber-800  border-amber-200',
  sales_executive: 'bg-teal-100   text-teal-800   border-teal-200',
  hr_manager:      'bg-pink-100   text-pink-800   border-pink-200',
};

// Modules for the Chakravyuh Permission Configuration Matrix
const SYSTEM_MODULES = [
  { id: 'khata',         label: 'Khata / Customers' },
  { id: 'sales',         label: 'Sales Billing' },
  { id: 'purchases',     label: 'Purchases' },
  { id: 'stock',         label: 'Stock & Godown' },
  { id: 'cashbook',      label: 'Cashbook (Galla)' },
  { id: 'reports',       label: 'Reports & Tax' },
  { id: 'payments',      label: 'Payment Settings' },
  { id: 'about_editor',  label: 'About Editor' },
  { id: 'backup',        label: 'Backup & Reset' },
];

export const SuperAdminPanel: React.FC = () => {
  const {
    appUser,
    companyProfile,
    updateCompanyProfile,
    allUsers,
    pendingUsers,
    updateUserRole,
    approveUser,
    rejectUser,
    deactivateUser,
    reactivateUser,
    deleteUser,
    logout,
  } = useAuth();

  const {
    exportFullDatabaseBackup,
    restoreDatabaseFromBackup,
    customers,
    setCustomers,
    invoices,
    setInvoices,
    purchases,
    setPurchases,
  } = useEnterprise();

  const [activeTab, setActiveTab] = useState<AdminTab>(
    pendingUsers.length > 0 ? 'approvals' : 'permissions'
  );
  const [editCompany, setEditCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState<CompanyProfile>(
    companyProfile || DEFAULT_COMPANY
  );
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveErr, setSaveErr] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Permission Configuration Matrix State (Chakravyuh Image 1)
  const [rolePerms, setRolePerms] = useState<Record<string, string[]>>(() => {
    return (
      companyProfile?.rolePermissions ||
      DEFAULT_COMPANY.rolePermissions || {
        manager: ['khata', 'sales', 'purchases', 'stock', 'cashbook', 'reports'],
        accountant: ['khata', 'sales', 'cashbook', 'reports'],
        sales_executive: ['khata', 'sales'],
        stock_manager: ['stock', 'purchases'],
        hr_manager: ['stock'],
      }
    );
  });

  // Restore file input ref
  const restoreFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (companyProfile) {
      setCompanyForm(companyProfile);
      if (companyProfile.rolePermissions) {
        setRolePerms(companyProfile.rolePermissions);
      }
    }
  }, [companyProfile]);

  if (!appUser || (appUser.role !== 'super_admin' && appUser.role !== 'owner')) {
    return (
      <div className="flex items-center justify-center min-h-[400px] flex-col gap-3 text-slate-500">
        <Shield className="w-12 h-12 text-slate-300" />
        <p className="font-semibold">Access Denied — Super Admin only</p>
      </div>
    );
  }

  const showNotification = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(''), 3500);
  };

  const handleSaveCompany = async () => {
    setSaving(true);
    setSaveMsg('');
    setSaveErr('');
    try {
      await updateCompanyProfile(companyForm);
      showNotification('कंपनी प्रोफाइल सफलतापूर्वक अपडेट हो गई!');
      setEditCompany(false);
    } catch (e: any) {
      setSaveErr(e.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  // Toggle Matrix Cell (Chakravyuh Image 1)
  const toggleRolePermission = (roleKey: string, moduleId: string) => {
    setRolePerms((prev) => {
      const current = prev[roleKey] || [];
      const updated = current.includes(moduleId)
        ? current.filter((m) => m !== moduleId)
        : [...current, moduleId];
      return { ...prev, [roleKey]: updated };
    });
  };

  const handleSavePermissions = async () => {
    setSaving(true);
    try {
      await updateCompanyProfile({ rolePermissions: rolePerms });
      showNotification('रोल्स और परमिशन मैट्रिक्स सफलतापूर्वक सेव हो गई!');
    } catch (e: any) {
      setSaveErr(e.message || 'Error saving permissions');
    } finally {
      setSaving(false);
    }
  };

  // Save About Section (Chakravyuh Image 2)
  const handleSaveAboutSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCompanyProfile({
        name: companyForm.name,
        aboutDescription: companyForm.aboutDescription,
        establishedYear: Number(companyForm.establishedYear) || 2002,
        location: companyForm.location,
        gstNo: companyForm.gstNo,
        vision: companyForm.vision,
        mission: companyForm.mission,
        logoURL: companyForm.logoURL,
      });
      showNotification('About Section सफलतापूर्वक अपडेट हुआ! पब्लिक वेबसाइट पर लाइव है।');
    } catch (e: any) {
      setSaveErr(e.message || 'Error saving about section');
    } finally {
      setSaving(false);
    }
  };

  // Save Payment Settings (Chakravyuh Image 3)
  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCompanyProfile({
        enableUpiQr: companyForm.enableUpiQr,
        payeeName: companyForm.payeeName,
        upiId: companyForm.upiId,
        requirePaymentScreenshot: companyForm.requirePaymentScreenshot,
        customQrUrl: companyForm.customQrUrl,
      });
      showNotification('पेमेंट सेटिंग्स और UPI QR सफलतापूर्वक सेव हो गए!');
    } catch (e: any) {
      setSaveErr(e.message || 'Error saving payment settings');
    } finally {
      setSaving(false);
    }
  };

  // Download Customers Khata CSV
  const handleDownloadCustomersCsv = () => {
    const headers = 'Customer ID,Name,Firm Name,Phone,Current Outstanding,Total Sales,Status\n';
    const rows = customers
      .map(
        (c) =>
          `"${c.customerId}","${c.name}","${c.firmName}","${c.phone}",${c.currentOutstanding},${c.totalSales},"${c.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Goyal_Cattle_Feed_Customers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Customers CSV डाउनलोड शुरू हो गया!');
  };

  // Print/PDF Report
  const handleOpenPrintReport = () => {
    window.print();
  };

  // Financial Year Reset / Archive Ledger
  const handleResetFinancialYear = () => {
    const confirmPrompt = window.prompt(
      'चेतावनी: यह क्रिया सभी ग्राहकों के बहीखाते का बकाया शून्य (₹0) कर देगी और नया वित्तीय वर्ष शुरू करेगी।\n\nपुष्टि करने के लिए "RESET" टाइप करें:'
    );
    if (confirmPrompt === 'RESET') {
      const resetCust = customers.map((c) => ({
        ...c,
        currentOutstanding: 0,
        totalSales: 0,
      }));
      setCustomers(resetCust);
      setInvoices([]);
      setPurchases([]);
      localStorage.setItem('goyal_customers', JSON.stringify(resetCust));
      localStorage.removeItem('goyal_khata_ledger_entries');
      showNotification('नया बहीखाता रीसेट हो गया! सभी बकाया ₹0 सेट हो गए।');
    }
  };

  // Handle Restore JSON File
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const ok = restoreDatabaseFromBackup(text);
        if (ok) {
          showNotification('बैकअप सफलतापूर्वक रिस्टोर हो गया!');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          alert('बैकअप फाइल अमान्य है');
        }
      } catch {
        alert('बैकअप फाइल पढ़ने में त्रुटि हुई');
      }
    };
    reader.readAsText(file);
  };

  const filteredUsers = allUsers.filter(
    (u) =>
      u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const TABS: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'approvals',        label: 'Staff Approvals', icon: UserCheck, badge: pendingUsers.length },
    { id: 'permissions',      label: 'Roles & Permissions', icon: Sliders },
    { id: 'about_editor',     label: 'About Section', icon: FileText },
    { id: 'payment_settings', label: 'Payment Settings', icon: QrCode },
    { id: 'backup_reset',     label: 'Backup & Reset', icon: Database },
    { id: 'users',            label: 'User Management', icon: Users },
    { id: 'company',          label: 'Company Profile', icon: Building2 },
    { id: 'settings',         label: 'App Settings', icon: Settings },
  ];

  return (
    <div
      className="min-h-screen bg-slate-900 text-slate-100 pb-16 select-none"
      style={{ fontFamily: "'Inter', 'Noto Sans Devanagari', sans-serif" }}
    >
      {/* ── TOP HEADER (CHAKRAVYUH THEME) ── */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-black text-lg leading-none text-white tracking-wide flex items-center gap-2">
              <span>CHAKRAVYUH 2K26</span>
              <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                Goyal Cattle Feed Admin
              </span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              Vatsal Goyal · <span className="text-emerald-400 font-bold">SUPER ADMIN</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Public Portal</span>
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-xl text-xs font-bold transition-colors border border-rose-800/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ── HORIZONTAL SCROLLABLE TABS (CHAKRAVYUH NAVIGATION) ── */}
      <div className="bg-slate-950/60 border-b border-slate-800 px-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max py-2">
          {TABS.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <t.icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{t.label}</span>
                {t.badge !== undefined && t.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast Alert */}
      {saveMsg && (
        <div className="max-w-5xl mx-auto px-6 pt-4">
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{saveMsg}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">

        {/* ── 1. STAFF APPROVALS (CHAKRAVYUH APPROVAL DESK) ── */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>Staff Registration Approvals</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                    {pendingUsers.length} Pending Requests
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Chakravyuh Security Gate: Approve or decline new Munim, Labour, and Sales personnel registrations.
                </p>
              </div>
            </div>

            {pendingUsers.length === 0 ? (
              <div className="bg-slate-950 rounded-3xl border border-slate-800 p-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">All Staff Requests Cleared!</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No pending staff registration requests at this time. New registrations will automatically appear here for your review.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingUsers.map((u) => (
                  <div
                    key={u.uid}
                    className="bg-slate-950 rounded-2xl border-2 border-amber-500/40 p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black text-base flex items-center justify-center shadow-md shrink-0">
                        {u.displayName ? u.displayName.substring(0, 2).toUpperCase() : 'ST'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-white text-base">{u.displayName}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                            Applied: {ROLE_LABELS[u.role] || u.role}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          {u.phone && <span>📞 {u.phone}</span>}
                          <span>✉️ {u.email}</span>
                          <span>🕒 {new Date(u.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <select
                        defaultValue={u.role}
                        onChange={(e) => updateUserRole(u.uid, e.target.value as UserRole)}
                        className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-700 bg-slate-900 text-slate-200 outline-none"
                      >
                        <option value="manager">Manager / Munim</option>
                        <option value="accountant">Accountant</option>
                        <option value="sales_executive">Salesman (Counter Billing)</option>
                        <option value="stock_manager">Stock Manager / Godown Labour</option>
                        <option value="hr_manager">Transport / Driver</option>
                      </select>

                      <button
                        onClick={() => approveUser(u.uid)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Approve Karein</span>
                      </button>

                      <button
                        onClick={() => rejectUser(u.uid)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-800 text-rose-400 hover:bg-rose-950 text-xs font-bold transition-all cursor-pointer"
                      >
                        <UserX className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── 2. ROLES & PERMISSION MATRIX (CHAKRAVYUH IMAGE 1) ── */}
        {activeTab === 'permissions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  <span>System Roles & Permissions</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Super Admin exclusive: configure dynamic categories, toggle tab permissions, and provision staff scopes.
                </p>
              </div>

              <button
                onClick={handleSavePermissions}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md cursor-pointer self-start sm:self-auto"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Permissions Matrix</span>
              </button>
            </div>

            {/* Matrix Table */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="uppercase tracking-wider">PERMISSION CONFIGURATION MATRIX</span>
                <span className="text-[11px] text-emerald-400">Green = Access Granted</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 sticky left-0 bg-slate-900 z-10">STAFF ROLE</th>
                      {SYSTEM_MODULES.map((m) => (
                        <th key={m.id} className="py-3 px-3 text-center whitespace-nowrap">
                          {m.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-semibold">
                    {[
                      { key: 'manager', label: 'Manager / Munim' },
                      { key: 'accountant', label: 'Accountant' },
                      { key: 'sales_executive', label: 'Salesman (Counter Billing)' },
                      { key: 'stock_manager', label: 'Stock Manager / Labour' },
                      { key: 'hr_manager', label: 'Logistics / Driver' },
                    ].map((role) => {
                      const enabledList = rolePerms[role.key] || [];

                      return (
                        <tr key={role.key} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-200 sticky left-0 bg-slate-950 z-10">
                            {role.label}
                          </td>
                          {SYSTEM_MODULES.map((m) => {
                            const isChecked = enabledList.includes(m.id);

                            return (
                              <td key={m.id} className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => toggleRolePermission(role.key, m.id)}
                                  className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all cursor-pointer ${
                                    isChecked
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xs'
                                      : 'bg-slate-900 text-slate-700 border border-slate-800 hover:border-slate-700'
                                  }`}
                                >
                                  {isChecked ? (
                                    <Check className="w-4 h-4 stroke-[3]" />
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                  )}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. EDITABLE ABOUT SECTION (CHAKRAVYUH IMAGE 2) ── */}
        {activeTab === 'about_editor' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span>Public About Section Editor</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Complete editable public page controls: changes saved here immediately sync to the website /about route.
                </p>
              </div>

              <button
                onClick={handleSaveAboutSection}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md cursor-pointer self-start sm:self-auto"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes (सेव करें)</span>
              </button>
            </div>

            <form onSubmit={handleSaveAboutSection} className="bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-5">
              {/* Store Name */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                  STORE / BUSINESS NAME *
                </label>
                <input
                  type="text"
                  required
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                  STORE LOGO / IMAGE URL
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={companyForm.logoURL || '/images/goyal_shop_real.png'}
                    alt="Logo Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-900 shrink-0"
                  />
                  <input
                    type="text"
                    value={companyForm.logoURL || ''}
                    onChange={(e) => setCompanyForm((p) => ({ ...p, logoURL: e.target.value }))}
                    placeholder="/images/goyal_shop_real.png"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                  ABOUT DESCRIPTION *
                </label>
                <textarea
                  rows={4}
                  required
                  value={companyForm.aboutDescription || ''}
                  onChange={(e) => setCompanyForm((p) => ({ ...p, aboutDescription: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm leading-relaxed text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* 3 Columns: Estd, Location, GST */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                    ESTABLISHED YEAR
                  </label>
                  <input
                    type="number"
                    value={companyForm.establishedYear || 2002}
                    onChange={(e) => setCompanyForm((p) => ({ ...p, establishedYear: Number(e.target.value) }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                    LOCATION
                  </label>
                  <input
                    type="text"
                    value={companyForm.location || 'Kavi Nagar, near Indra Chowk, Gajraula, UP'}
                    onChange={(e) => setCompanyForm((p) => ({ ...p, location: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                    AFFILIATION / GSTIN
                  </label>
                  <input
                    type="text"
                    value={companyForm.gstNo}
                    onChange={(e) => setCompanyForm((p) => ({ ...p, gstNo: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Vision */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                  VISION
                </label>
                <textarea
                  rows={2}
                  value={companyForm.vision || ''}
                  onChange={(e) => setCompanyForm((p) => ({ ...p, vision: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Mission */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                  MISSION (ONE POINT PER LINE)
                </label>
                <textarea
                  rows={3}
                  value={companyForm.mission || ''}
                  onChange={(e) => setCompanyForm((p) => ({ ...p, mission: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </form>
          </div>
        )}

        {/* ── 4. PAYMENT SETTINGS (CHAKRAVYUH IMAGE 3) ── */}
        {activeTab === 'payment_settings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-amber-400" />
                  <span>Payment Settings</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure UPI QR payment gateway for instant customer billing and payments.
                </p>
              </div>

              <button
                onClick={handleSavePaymentSettings}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md cursor-pointer self-start sm:self-auto"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>

            <form onSubmit={handleSavePaymentSettings} className="bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-6">
              {/* Toggle: Payment Gateway / Dynamic UPI QR */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-white text-sm">Payment Gateway / Dynamic UPI QR</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    When enabled, bills & invoices show the store UPI QR code for instant scanning via PhonePe, GPay, Paytm.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={companyForm.enableUpiQr !== false}
                    onChange={(e) => setCompanyForm((p) => ({ ...p, enableUpiQr: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>

              {/* Toggle: Require Payment Screenshot */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-white text-sm">Require Payment Screenshot / UTR</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Screenshot is optional — staff can submit payment entries with just the UTR / Transaction ID.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={companyForm.requirePaymentScreenshot || false}
                    onChange={(e) => setCompanyForm((p) => ({ ...p, requirePaymentScreenshot: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>

              {/* Form Fields & Live QR Preview */}
              <div className="grid md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                      PAYEE NAME (दुकान का नाम)
                    </label>
                    <input
                      type="text"
                      value={companyForm.payeeName || 'Goyal Cattle Feed Store'}
                      onChange={(e) => setCompanyForm((p) => ({ ...p, payeeName: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                      UPI ID (VPA) *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyForm.upiId || '9837049021@upi'}
                      onChange={(e) => setCompanyForm((p) => ({ ...p, upiId: e.target.value }))}
                      placeholder="9837049021@upi"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Your UPI handle — customers can also type this manually if QR doesn't work.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                      OPTIONAL CUSTOM QR CODE IMAGE URL
                    </label>
                    <input
                      type="text"
                      value={companyForm.customQrUrl || ''}
                      onChange={(e) => setCompanyForm((p) => ({ ...p, customQrUrl: e.target.value }))}
                      placeholder="Leave empty to use automatic NPCI dynamic QR code"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* QR Code Preview Box */}
                <div className="md:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 p-5 text-center space-y-3">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    LIVE QR CODE PREVIEW
                  </span>
                  <div className="w-44 h-44 mx-auto bg-white p-2.5 rounded-2xl shadow-md flex items-center justify-center">
                    <img
                      src={
                        companyForm.customQrUrl ||
                        getUpiQrCodeUrl({
                          amount: 100,
                          payeeName: companyForm.payeeName || 'Goyal Cattle Feed Store',
                          vpa: companyForm.upiId || '9837049021@upi',
                        })
                      }
                      alt="Store UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs font-bold text-slate-200">
                    {companyForm.upiId || '9837049021@upi'}
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ── 5. BACKUP & FINANCIAL YEAR RESET (CHAKRAVYUH IMAGE 4) ── */}
        {activeTab === 'backup_reset' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <span>Backup & Financial Year Reset</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Super Admin tools — export data in multiple formats or archive the financial year ledger.
              </p>
            </div>

            {/* 3 Large Action Cards (Image 4) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Full JSON Backup */}
              <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-white">Full JSON Backup</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Complete raw backup — customers, khata ledger entries, products, stock, billing, and settings.
                  </p>
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                    json - restore-ready
                  </span>
                </div>

                <button
                  onClick={exportFullDatabaseBackup}
                  className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download JSON</span>
                </button>
              </div>

              {/* Card 2: Customers CSV */}
              <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-white">Customers Khata CSV</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Customers ledger table exported as CSV — opens directly in Microsoft Excel, Google Sheets, or LibreOffice Calc.
                  </p>
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    csv - Excel / Sheets ready
                  </span>
                </div>

                <button
                  onClick={handleDownloadCustomersCsv}
                  className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CSV</span>
                </button>
              </div>

              {/* Card 3: Full Backup PDF */}
              <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-white">Full Backup PDF</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Complete printable ledger summary — all customers, outstanding balance, and official store stamp.
                  </p>
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    pdf - print ready
                  </span>
                </div>

                <button
                  onClick={handleOpenPrintReport}
                  className="mt-6 w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Open PDF Report</span>
                </button>
              </div>
            </div>

            {/* Restore from File Card */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Restore from JSON Backup File</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Upload a previously exported .json file to restore all ledger entries, customers, and catalog settings.
                </p>
              </div>

              <input
                type="file"
                ref={restoreFileRef}
                accept=".json"
                onChange={handleRestoreFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => restoreFileRef.current?.click()}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Upload & Restore JSON
              </button>
            </div>

            {/* Danger Zone: Reset Financial Year */}
            <div className="bg-rose-950/20 rounded-3xl border border-rose-900/60 p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-rose-400 font-extrabold text-sm">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <span>Financial Year Reset / Archive Ledger (नया बहीखाता)</span>
              </div>
              <p className="text-xs text-rose-300/80 leading-relaxed max-w-3xl">
                दीपावली या 31 मार्च पर जब पुराना बहीखाता पूरा हो जाता है, तब नया वर्ष शुरू करने के लिए यह बटन दबाएं। यह क्रिया सभी ग्राहकों का बकाया ₹0 सेट कर देगी। कैटल फीड प्रोडक्ट्स और सेटिंग्स सुरक्षित रहेंगी।
              </p>
              <button
                onClick={handleResetFinancialYear}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
              >
                बहीखाता रीसेट करें (New Financial Year)
              </button>
            </div>
          </div>
        )}

        {/* ── 6. USER MANAGEMENT TAB ── */}
        {activeTab === 'users' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                User Management
                <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                  {allUsers.length} users
                </span>
              </h2>
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-3">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Koi user nahi mila</p>
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <UserCard
                    key={u.uid}
                    user={u}
                    currentUserUid={appUser.uid}
                    onRoleChange={updateUserRole}
                    onDeactivate={deactivateUser}
                    onReactivate={reactivateUser}
                    onDelete={deleteUser}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* ── 7. COMPANY PROFILE TAB ── */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Company Profile</h2>
              <div className="flex gap-2">
                {editCompany ? (
                  <>
                    <button
                      onClick={() => {
                        setEditCompany(false);
                        setCompanyForm(companyProfile || DEFAULT_COMPANY);
                      }}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                    <button
                      onClick={handleSaveCompany}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-colors"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Karein
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditCompany(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-colors"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Karein
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    disabled={!editCompany}
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-white disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-1">GSTIN</label>
                  <input
                    type="text"
                    disabled={!editCompany}
                    value={companyForm.gstNo}
                    onChange={(e) => setCompanyForm((p) => ({ ...p, gstNo: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs font-mono text-white disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    disabled={!editCompany}
                    value={companyForm.phone}
                    onChange={(e) => setCompanyForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-white disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-1">Address</label>
                  <input
                    type="text"
                    disabled={!editCompany}
                    value={companyForm.address}
                    onChange={(e) => setCompanyForm((p) => ({ ...p, address: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-white disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 8. APP SETTINGS TAB ── */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">App Settings</h2>

            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-4">
              <h3 className="font-extrabold text-white text-sm">Theme & Appearance</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={companyForm.primaryColor || '#065f46'}
                      onChange={(e) => setCompanyForm((p) => ({ ...p, primaryColor: e.target.value }))}
                      className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 font-mono">{companyForm.primaryColor || '#065f46'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Currency</label>
                  <select
                    value={companyForm.currency || 'INR'}
                    onChange={(e) => setCompanyForm((p) => ({ ...p, currency: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white"
                  >
                    <option value="INR">₹ INR — Indian Rupee</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ── Single User Card ──────────────────────────────────────────
const UserCard: React.FC<{
  user: AppUser;
  currentUserUid: string;
  onRoleChange: (uid: string, role: UserRole) => Promise<void>;
  onDeactivate: (uid: string) => Promise<void>;
  onReactivate: (uid: string) => Promise<void>;
  onDelete: (uid: string) => Promise<void>;
}> = ({ user, currentUserUid, onRoleChange, onDeactivate, onReactivate, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const isSelf = user.uid === currentUserUid;

  const wrap = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-slate-950 rounded-2xl border p-4 flex items-start justify-between gap-4 transition-all ${
        !user.isActive
          ? 'opacity-60 border-slate-800'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
          {user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-sm">{user.displayName}</span>
            {isSelf && (
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.2 rounded-full font-bold">
                You
              </span>
            )}
            {!user.isActive && (
              <span className="text-[10px] bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.2 rounded-full font-bold">
                Inactive
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
            <span>✉️ {user.email}</span>
            {user.phone && <span>📱 +91 {user.phone}</span>}
          </div>
          <div className={`inline-block mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${ROLE_COLORS[user.role]}`}>
            {ROLE_LABELS[user.role]}
          </div>
        </div>
      </div>

      {!isSelf && (
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={user.role}
            onChange={(e) => wrap(() => onRoleChange(user.uid, e.target.value as UserRole))}
            disabled={loading}
            className="text-xs border border-slate-800 rounded-lg px-2.5 py-1.5 bg-slate-900 text-slate-300 focus:outline-none focus:border-amber-500 disabled:opacity-50"
          >
            {Object.entries(ROLE_LABELS).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>

          {user.isActive ? (
            <button
              onClick={() => wrap(() => onDeactivate(user.uid))}
              disabled={loading}
              title="Deactivate user"
              className="p-2 rounded-lg text-amber-400 hover:bg-amber-950/40 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserX className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <button
              onClick={() => wrap(() => onReactivate(user.uid))}
              disabled={loading}
              title="Reactivate user"
              className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-950/40 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm(`"${user.displayName}" ko delete karein?`)) {
                wrap(() => onDelete(user.uid));
              }
            }}
            disabled={loading}
            title="Delete user permanently"
            className="p-2 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
