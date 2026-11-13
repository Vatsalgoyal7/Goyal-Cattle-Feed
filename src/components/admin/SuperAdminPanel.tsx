import React, { useState, useEffect } from 'react';
import { useAuth, AppUser, UserRole, DEFAULT_COMPANY, CompanyProfile } from '../../context/AuthContext';
import {
  Shield, Users, Building2, Settings, ChevronDown,
  Edit3, Save, X, Trash2, UserCheck, UserX,
  Plus, AlertCircle, CheckCircle, Loader2, LogOut,
  Phone, Mail, MapPin, Globe, CreditCard, Wheat,
  BarChart3, Package, Lock, Eye, EyeOff, RefreshCw,
  Camera, Upload
} from 'lucide-react';

type AdminTab = 'company' | 'users' | 'settings';

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin:     'Super Admin',
  owner:           'Owner / Maalik',
  manager:         'Manager',
  accountant:      'Accountant',
  stock_manager:   'Stock Manager',
  sales_executive: 'Sales Executive',
  hr_manager:      'HR Manager',
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

export const SuperAdminPanel: React.FC = () => {
  const { appUser, companyProfile, updateCompanyProfile, allUsers, updateUserRole, deactivateUser, reactivateUser, deleteUser, logout } = useAuth();
  const [activeTab, setActiveTab]   = useState<AdminTab>('company');
  const [editCompany, setEditCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState<CompanyProfile>(companyProfile || DEFAULT_COMPANY);
  const [saving, setSaving]         = useState(false);
  const [saveMsg, setSaveMsg]       = useState('');
  const [saveErr, setSaveErr]       = useState('');
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    if (companyProfile) setCompanyForm(companyProfile);
  }, [companyProfile]);

  if (!appUser || (appUser.role !== 'super_admin' && appUser.role !== 'owner')) {
    return (
      <div className="flex items-center justify-center min-h-[400px] flex-col gap-3 text-slate-500">
        <Shield className="w-12 h-12 text-slate-300" />
        <p className="font-semibold">Access Denied — Super Admin only</p>
      </div>
    );
  }

  const handleSaveCompany = async () => {
    setSaving(true); setSaveMsg(''); setSaveErr('');
    try {
      await updateCompanyProfile(companyForm);
      setSaveMsg('Company profile save ho gaya!');
      setEditCompany(false);
    } catch {
      setSaveErr('Save karte waqt error aaya. Dobara try karein.');
    } finally {
      setSaving(false);
      setTimeout(() => { setSaveMsg(''); setSaveErr(''); }, 3000);
    }
  };

  const filteredUsers = allUsers.filter(u =>
    u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const TABS: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'company',  label: 'Company Profile', icon: Building2 },
    { id: 'users',    label: 'User Management', icon: Users },
    { id: 'settings', label: 'App Settings',    icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white px-6 py-5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="font-black text-lg leading-none">Super Admin Panel</h1>
            <p className="text-emerald-300 text-xs mt-0.5">{appUser.displayName} · {ROLE_LABELS[appUser.role]}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6">
        <div className="flex gap-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all ${activeTab === t.id ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">

        {/* ── COMPANY PROFILE TAB ── */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Company Profile</h2>
              <div className="flex gap-2">
                {editCompany ? (
                  <>
                    <button onClick={() => { setEditCompany(false); setCompanyForm(companyProfile || DEFAULT_COMPANY); }}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                    <button onClick={handleSaveCompany} disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving...' : 'Save Karein'}
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditCompany(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors">
                    <Edit3 className="w-4 h-4" /> Edit Karein
                  </button>
                )}
              </div>
            </div>

            {saveMsg && (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl px-4 py-3 text-sm">
                <CheckCircle className="w-4 h-4" /> {saveMsg}
              </div>
            )}
            {saveErr && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4" /> {saveErr}
              </div>
            )}

            {/* Company Basic Info */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" /> Basic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { field: 'name',     label: 'Company Name',  placeholder: 'Goyal Cattle Feed Pvt. Ltd.', icon: Building2 },
                  { field: 'tagline',  label: 'Tagline',       placeholder: 'Khad ke liye ek vishwasniya naam', icon: Wheat },
                  { field: 'phone',    label: 'Phone',         placeholder: '+91 98765 43210', icon: Phone },
                  { field: 'email',    label: 'Email',         placeholder: 'info@company.com', icon: Mail },
                  { field: 'website',  label: 'Website',       placeholder: 'https://company.com', icon: Globe },
                  { field: 'gstNo',    label: 'GST Number',    placeholder: '09AAACC1206D1Z6', icon: CreditCard },
                  { field: 'panNo',    label: 'PAN Number',    placeholder: 'AAACC1206D', icon: CreditCard },
                  { field: 'financialYear', label: 'Financial Year', placeholder: '2024-25', icon: BarChart3 },
                ].map(({ field, label, placeholder, icon: Icon }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={(companyForm as any)[field] || ''}
                        onChange={e => setCompanyForm(prev => ({ ...prev, [field]: e.target.value }))}
                        disabled={!editCompany}
                        placeholder={placeholder}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-900 transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" /> Address
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { field: 'address', label: 'Street Address', placeholder: '123, Main Market, Sector 5' },
                  { field: 'city',    label: 'City',           placeholder: 'Bareilly' },
                  { field: 'state',   label: 'State',          placeholder: 'Uttar Pradesh' },
                  { field: 'pincode', label: 'PIN Code',       placeholder: '243001' },
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{label}</label>
                    <input
                      type="text"
                      value={(companyForm as any)[field] || ''}
                      onChange={e => setCompanyForm(prev => ({ ...prev, [field]: e.target.value }))}
                      disabled={!editCompany}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-900 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" /> Bank Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: 'bankName',   label: 'Bank Name',      placeholder: 'State Bank of India' },
                  { key: 'accountNo',  label: 'Account Number', placeholder: '1234567890' },
                  { key: 'ifsc',       label: 'IFSC Code',      placeholder: 'SBIN0001234' },
                  { key: 'branch',     label: 'Branch',         placeholder: 'Bareilly Main Branch' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{label}</label>
                    <input
                      type="text"
                      value={companyForm.bankDetails?.[key as keyof typeof companyForm.bankDetails] || ''}
                      onChange={e => setCompanyForm(prev => ({
                        ...prev,
                        bankDetails: { ...prev.bankDetails, [key]: e.target.value }
                      }))}
                      disabled={!editCompany}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-900 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                User Management
                <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {allUsers.length} users
                </span>
              </h2>
              <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="space-y-3">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Koi user nahi mila</p>
                </div>
              ) : (
                filteredUsers.map(u => (
                  <UserCard key={u.uid} user={u} currentUserUid={appUser.uid}
                    onRoleChange={updateUserRole} onDeactivate={deactivateUser}
                    onReactivate={reactivateUser} onDelete={deleteUser} />
                ))
              )}
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">App Settings</h2>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Branding & Colors</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={companyForm.primaryColor || '#065f46'}
                      onChange={e => setCompanyForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{companyForm.primaryColor || '#065f46'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Currency</label>
                  <select value={companyForm.currency || 'INR'}
                    onChange={e => setCompanyForm(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="INR">₹ INR — Indian Rupee</option>
                    <option value="USD">$ USD — US Dollar</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSaveCompany} disabled={saving}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Settings Save Karein
              </button>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900 p-6">
              <h3 className="font-bold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Danger Zone
              </h3>
              <p className="text-xs text-red-600 dark:text-red-400 mb-4">
                Yeh actions reversible nahi hain. Bahut sochkar karo.
              </p>
              <button className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 text-xs font-semibold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                All Data Clear Karein (Dangerous!)
              </button>
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
    try { await fn(); } finally { setLoading(false); }
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 flex items-start justify-between gap-4 transition-all ${!user.isActive ? 'opacity-60 border-slate-200 dark:border-slate-800' : 'border-slate-200 dark:border-slate-800 hover:shadow-md'}`}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
          {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900 dark:text-white text-sm">{user.displayName}</span>
            {isSelf && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">You</span>}
            {!user.isActive && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium">Inactive</span>}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5 flex-wrap">
            <span>✉️ {user.email}</span>
            {user.phone && <span>📱 +91 {user.phone}</span>}
            {(user as any).city && <span>📍 {(user as any).city}</span>}
            {(user as any).department && <span>🏢 {(user as any).department}</span>}
          </div>
          <div className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ROLE_COLORS[user.role]}`}>
            {ROLE_LABELS[user.role]}
          </div>
        </div>
      </div>

      {!isSelf && (
        <div className="flex items-center gap-2 shrink-0">
          {/* Role selector */}
          <select value={user.role}
            onChange={e => wrap(() => onRoleChange(user.uid, e.target.value as UserRole))}
            disabled={loading}
            className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50">
            {Object.entries(ROLE_LABELS).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>

          {user.isActive ? (
            <button onClick={() => wrap(() => onDeactivate(user.uid))} disabled={loading}
              title="Deactivate user"
              className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserX className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <button onClick={() => wrap(() => onReactivate(user.uid))} disabled={loading}
              title="Reactivate user"
              className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
            </button>
          )}

          <button onClick={() => { if (window.confirm(`"${user.displayName}" ko delete karein?`)) wrap(() => onDelete(user.uid)); }}
            disabled={loading}
            title="Delete user permanently"
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
