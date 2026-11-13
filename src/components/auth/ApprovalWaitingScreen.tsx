import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../common/BrandLogo';
import { Clock, ShieldCheck, Phone, LogOut, RefreshCw, MessageSquare } from 'lucide-react';

export const ApprovalWaitingScreen: React.FC = () => {
  const { appUser, logout } = useAuth();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleWhatsAppHelp = () => {
    const text = encodeURIComponent(
      `नमस्ते Vatsal ji, मैंने Goyal Cattle Feed Business OS पर '${appUser?.displayName || 'Staff'}' (${appUser?.phone || appUser?.email}) के रूप में रजिस्टर किया है। कृपया मेरा अकाउंट अप्रूव करें। धन्यवाद!`
    );
    window.open(`https://wa.me/917310698091?text=${text}`, '_blank');
  };

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 select-none"
      style={{ fontFamily: "'Inter', 'Noto Sans Devanagari', sans-serif" }}
    >
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 text-center space-y-6">
        <BrandLogo size="md" className="justify-center mx-auto" />

        {/* Animated Hourglass / Clock Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-10 h-10 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs shadow-md">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Text Heading */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 tracking-wide">
            पेंडिंग अप्रूवल (APPROVAL PENDING)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            आपका खाता समीक्षा में है
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            नमस्ते <strong>{appUser?.displayName || 'Staff Member'}</strong>! व्यापारिक सुरक्षा हेतु नए खातों को <strong>SuperAdmin (वत्सल गोयल)</strong> के अनुमोदन के बाद ही एक्सेस मिलता है।
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 text-left text-xs space-y-2.5 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-500">रजिस्टर्ड ईमेल / मोबाइल:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
              {appUser?.phone || appUser?.email}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-500">आवेदन किया पद (Role):</span>
            <span className="font-bold text-emerald-800 dark:text-emerald-400 uppercase">
              {appUser?.role?.replace('_', ' ') || 'Staff Member'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">स्टेटस:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              SuperAdmin Review Awaiting
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleWhatsAppHelp}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-300" />
            <span>वत्सल गोयल जी को व्हाट्सएप पर सूचित करें</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>स्टेटस जांचें</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉग आउट</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
          Goyal Cattle Feed Store · Kavi Nagar, Indra Chowk, Gajraula · +91 7310698091
        </p>
      </div>
    </div>
  );
};
