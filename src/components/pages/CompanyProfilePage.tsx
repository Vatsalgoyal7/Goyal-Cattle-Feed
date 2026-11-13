import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  FileCheck2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Landmark,
  QrCode,
  Stamp,
  Edit,
  Save,
  CheckCircle,
  Wheat,
} from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const { companyProfile, updateCompanyProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(companyProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Card with Plant Photography */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="h-48 sm:h-72 w-full relative">
          <img
            src="/images/goyal_shop_real.png"
            alt="Goyal Cattle Feed Store - Gajraula Real Store Front"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>

        <div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-800/90 text-white flex items-center justify-center shrink-0 shadow-lg ring-2 ring-amber-400">
              <Wheat className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {companyProfile.companyName}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-300 font-medium">
                {companyProfile.tagline} · Est. {companyProfile.establishedYear}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto border border-white/30"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Company Details'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">Company profile updated and synced across all invoice templates.</span>
        </div>
      )}

      {/* Main Details View / Form */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Edit Corporate & Statutory Records
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">GSTIN Number</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Company PAN</label>
              <input
                type="text"
                value={formData.pan}
                onChange={e => setFormData({ ...formData, pan: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Registered Address</label>
              <textarea
                rows={2}
                value={formData.registeredAddress}
                onChange={e => setFormData({ ...formData, registeredAddress: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Feed Factory Address</label>
              <textarea
                rows={2}
                value={formData.factoryAddress}
                onChange={e => setFormData({ ...formData, factoryAddress: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">A/C Number</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">IFSC Code</label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={e => setFormData({ ...formData, ifscCode: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Business UPI ID</label>
              <input
                type="text"
                value={formData.upiId}
                onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" /> Save Company Profile
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Statutory & Contact Card */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <FileCheck2 className="w-4 h-4 text-emerald-700" /> Statutory & Corporate Registration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">GSTIN (Punjab)</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{companyProfile.gstin}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">PAN Number</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{companyProfile.pan}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Corporate CIN</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{companyProfile.cin}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-emerald-700" /> Operational Facilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    Registered Commercial Head Office
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {companyProfile.registeredAddress}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    Feed Mill & Grain Silo Complex
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {companyProfile.factoryAddress}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <Phone className="w-4 h-4 text-emerald-700" /> Communications & Web
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{companyProfile.phone.split('/')[0]}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{companyProfile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>{companyProfile.website}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Banking & Stamp Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <Landmark className="w-4 h-4 text-emerald-700" /> Banking & Settlement
              </h3>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{companyProfile.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account No:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{companyProfile.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IFSC Code:</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{companyProfile.ifscCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Branch:</span>
                  <span className="text-slate-700 dark:text-slate-300">{companyProfile.branchName}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Instant UPI:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" /> {companyProfile.upiId}
                  </span>
                </div>
              </div>
            </div>

            {/* Stamp & Authorized Signatory preview */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <Stamp className="w-4 h-4 text-emerald-700" /> Official Stamp & Signatory
              </h3>
              <div className="p-4 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 text-center space-y-2">
                <div className="inline-block p-2 rounded-full border-2 border-emerald-700 dark:border-emerald-500 text-emerald-800 dark:text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                  GOYAL CATTLE FEED STORE ★ GAJRAULA
                </div>
                <div className="font-serif italic text-lg text-slate-800 dark:text-slate-200">
                  {companyProfile.authorizedSignatory}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {companyProfile.authorizedSignatory} ({companyProfile.signatoryDesignation})
                </div>
              </div>
            </div>
          </div>

          {/* Real Photo Gallery & Google Maps Verified Location */}
          <div className="lg:col-span-3 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-700" /> Authentic Store & Brand Photography (Gajraula)
                </h3>
                <p className="text-xs text-slate-500">
                  Real pictures captured from Goyal Cattle Feed Store, Kavi Nagar, Indra Chowk, Gajraula, UP
                </p>
              </div>
              <a
                href="https://maps.app.goo.gl/D8MwEcaxc7GNyc8r7"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors shrink-0"
              >
                <span>⭐ 5.0 Google Maps Store Profile</span>
                <Globe className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative group">
                <img
                  src="/images/goyal_shop_real.png"
                  alt="Goyal Cattle Feed Store Front"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent text-white text-xs">
                  <p className="font-bold">Main Store & Compound Facade</p>
                  <p className="text-[10px] text-amber-300">Kavi Nagar, near Indra Chowk, Gajraula</p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative group bg-amber-50">
                <img
                  src="/images/banner_sp_pashu_aahar.png"
                  alt="SP Pashu Aahar Signboard"
                  className="w-full h-48 object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent text-white text-xs">
                  <p className="font-bold">SP Pashu Aahar</p>
                  <p className="text-[10px] text-amber-300">गाय - भैंस का सर्वोत्तम आहार</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative group bg-emerald-50">
                  <img
                    src="/images/banner_gavaksha.png"
                    alt="Gavaksha Pashu Aahar"
                    className="w-full h-22 object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent text-white text-[10px]">
                    <p className="font-bold">Gavaksha Feed</p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative group bg-blue-50">
                  <img
                    src="/images/banner_satkar.png"
                    alt="Satkar Pashu Aahar"
                    className="w-full h-22 object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent text-white text-[10px]">
                    <p className="font-bold">Satkar Feed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
