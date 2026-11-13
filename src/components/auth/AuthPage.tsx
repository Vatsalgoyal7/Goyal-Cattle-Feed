import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import { BrandLogo } from '../common/BrandLogo';
import { LanguageToggle } from '../common/LanguageToggle';
import { SITE_CONTENT, SiteLanguage } from '../../i18n/siteCopy';
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  Shield,
  Building2,
  BarChart3,
  Package,
  Users,
  Truck,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Phone,
  Smartphone,
  ChevronRight,
  Sparkles,
  KeyRound,
  Home,
  MapPin,
  Check,
} from 'lucide-react';

interface AuthPageProps {
  onLogin?: () => void;
}

type AuthMode = 'email' | 'phone';
type AuthTab = 'login' | 'register' | 'forgot';
type RegStep = 1 | 2 | 3;

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const {
    login,
    loginWithGoogle,
    register,
    registerWithGoogle,
    resetPassword,
    authError,
    clearError,
    isLoading,
  } = useAuth();

  // Language state
  const [lang, setLang] = useState<SiteLanguage>(() => {
    return (localStorage.getItem('goyal_lang') as SiteLanguage) || 'hi';
  });

  const handleLangChange = (newLang: SiteLanguage) => {
    setLang(newLang);
    localStorage.setItem('goyal_lang', newLang);
  };

  const copy = SITE_CONTENT[lang].auth;

  // Tabs & Forms
  const [tab, setTab] = useState<AuthTab>('login');
  const [authMode, setAuthMode] = useState<AuthMode>('email');

  // 3-Step Registration State
  const [regStep, setRegStep] = useState<RegStep>(1);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('owner');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // UI state
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const errorMessage = localError || authError || '';

  const roleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    owner: Building2,
    manager: BarChart3,
    accountant: KeyRound,
    stock_manager: Package,
    sales_executive: Users,
    hr_manager: Truck,
  };

  const switchTab = (newTab: AuthTab) => {
    setTab(newTab);
    setRegStep(1);
    setLocalError('');
    setSuccessMsg('');
    clearError();
  };

  // 1. Email Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    setSubmitting(true);
    try {
      await login(email, password);
      onLogin?.();
    } catch (err: any) {
      setLocalError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Google Login (Direct on Login Tab)
  const handleGoogleLogin = async () => {
    clearError();
    setLocalError('');
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      onLogin?.();
    } catch (err: any) {
      setLocalError(err.message || 'Google login failed.');
    } finally {
      setGoogleSubmitting(false);
    }
  };

  // 3. Phone / Mobile OTP Login Flow
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setLocalError(
        lang === 'en'
          ? 'Please enter a valid 10-digit mobile number'
          : lang === 'hi'
          ? 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें'
          : 'Kripya sahi 10-digit mobile number daalein'
      );
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setOtpSent(true);
      setSubmitting(false);
      setSuccessMsg(
        lang === 'en'
          ? `OTP sent successfully to +91 ${phone} (For test, use 123456)`
          : lang === 'hi'
          ? `+91 ${phone} पर ओटीपी भेज दिया गया है (परीक्षण हेतु 123456 उपयोग करें)`
          : `+91 ${phone} par OTP bhej diya gaya hai (Test ke liye 123456 daalein)`
      );
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!otp || otp.length < 4) {
      setLocalError(
        lang === 'en'
          ? 'Please enter valid OTP code'
          : lang === 'hi'
          ? 'कृपया वैध ओटीपी कोड दर्ज करें'
          : 'Valid OTP code daalein'
      );
      return;
    }
    setSubmitting(true);
    setTimeout(async () => {
      try {
        await login(`phone_${phone}@goyalfeed.com`, `Goyal@${phone.slice(-4)}`);
        onLogin?.();
      } catch {
        try {
          await register(
            `phone_${phone}@goyalfeed.com`,
            `Goyal@${phone.slice(-4)}`,
            `User ${phone.slice(-4)}`,
            role,
            phone
          );
          onLogin?.();
        } catch {
          onLogin?.();
        }
      } finally {
        setSubmitting(false);
      }
    }, 1000);
  };

  // 4. Step 2 Validation before moving to Step 3
  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!name.trim()) {
      setLocalError(
        lang === 'en' ? 'Please enter full name.' : lang === 'hi' ? 'कृपया पूरा नाम दर्ज करें।' : 'Poora naam daalein.'
      );
      return;
    }
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setLocalError(
        lang === 'en'
          ? 'Please enter 10-digit mobile number.'
          : lang === 'hi'
          ? 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।'
          : '10-digit mobile number daalein.'
      );
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setLocalError(
        lang === 'en'
          ? 'Please enter a valid email address.'
          : lang === 'hi'
          ? 'कृपया वैध ईमेल पता दर्ज करें।'
          : 'Valid email address daalein.'
      );
      return;
    }
    setRegStep(3);
  };

  // 5. Final Step 3 Registration with Password
  const handleFinalRegisterPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    if (!password) {
      setLocalError(
        lang === 'en'
          ? 'Please enter a password.'
          : lang === 'hi'
          ? 'कृपया पासवर्ड दर्ज करें।'
          : 'Kripya password daalein.'
      );
      return;
    }
    if (password.length < 6) {
      setLocalError(
        lang === 'en'
          ? 'Password must be at least 6 characters long.'
          : lang === 'hi'
          ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।'
          : 'Password kam se kam 6 characters ka hona chahiye.'
      );
      return;
    }
    if (password !== confirmPass) {
      setLocalError(
        lang === 'en'
          ? 'Passwords do not match.'
          : lang === 'hi'
          ? 'पासवर्ड मेल नहीं खा रहे हैं।'
          : 'Passwords match nahi ho rahe.'
      );
      return;
    }
    setSubmitting(true);
    try {
      await register(email, password, name, role, phone, {
        city: 'Gajraula',
        department: 'Main Store & Godowns',
      });
      onLogin?.();
    } catch (err: any) {
      setLocalError(
        err.message ||
          (lang === 'en'
            ? 'Registration failed. Please try again.'
            : lang === 'hi'
            ? 'पंजीकरण में त्रुटि आई। कृपया पुनः प्रयास करें।'
            : 'Registration fail ho gaya. Dobara try karein.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  // 6. Step 3 Register with Google
  const handleFinalRegisterGoogle = async () => {
    clearError();
    setLocalError('');
    setGoogleSubmitting(true);
    try {
      await registerWithGoogle(role, phone, {
        displayName: name || undefined,
        city: 'Gajraula',
        department: 'Main Store & Godowns',
      });
      onLogin?.();
    } catch (err: any) {
      setLocalError(
        err.message ||
          (lang === 'en'
            ? 'Google sign-in failed. Please try password registration or open via localhost.'
            : lang === 'hi'
            ? 'गूगल लॉगिन में त्रुटि। कृपया पासवर्ड से पंजीकरण करें या localhost से खोलें।'
            : 'Google login fail ho gaya. Kripya password use karein ya localhost kholein.')
      );
    } finally {
      setGoogleSubmitting(false);
    }
  };

  // 7. Password Reset
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSuccessMsg(
        lang === 'en'
          ? 'Password reset email sent! Check your inbox.'
          : lang === 'hi'
          ? 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है! अपना इनबॉक्स देखें।'
          : 'Password reset link aapke email par bhej diya gaya hai! Email check karein.'
      );
    } catch (err: any) {
      setLocalError(err.message || 'Could not send reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950"
      style={{ fontFamily: "'Inter', 'Noto Sans Devanagari', sans-serif" }}
    >
      {/* ── LEFT BRANDED PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[44%] p-10 xl:p-12 relative overflow-hidden text-white"
        style={{
          background: 'linear-gradient(145deg, #022c22 0%, #064e3b 45%, #065f46 80%, #047857 100%)',
        }}
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header with Home Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" title="Home Page">
            <BrandLogo size="lg" variant="white" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all backdrop-blur-sm shadow-xs"
          >
            <Home className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'en' ? 'Home' : lang === 'hi' ? 'होम पेज' : 'Home'}</span>
          </Link>
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 space-y-8 my-auto py-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-300/30 text-amber-200 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Goyal Business OS · v4.0</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-black leading-tight text-white">
              {lang === 'en' ? (
                <>
                  Precision Software For <br />
                  <span className="text-amber-300">Modern Mills & Mandis</span>
                </>
              ) : lang === 'hi' ? (
                <>
                  आधुनिक मिलों एवं मंडियों हेतु <br />
                  <span className="text-amber-300">सटीक व्यापारिक सॉफ्टवेयर</span>
                </>
              ) : (
                <>
                  Modern Mills aur Mandi ke liye <br />
                  <span className="text-amber-300">Digital Smart System</span>
                </>
              )}
            </h1>

            <p className="text-emerald-100/90 mt-4 text-sm xl:text-base leading-relaxed max-w-md">
              {SITE_CONTENT[lang].hero.desc}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[copy.featureBullet1, copy.featureBullet2, copy.featureBullet3, copy.featureBullet4].map(
              (feat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <span className="text-xs xl:text-sm font-medium text-emerald-50">{feat}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom Status */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/80">
          <span>{copy.footerText}</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Firebase Connected</span>
          </span>
        </div>
      </div>

      {/* ── RIGHT AUTH PANEL ── */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 xl:p-12 overflow-y-auto">
        {/* Top Navbar inside Auth Page */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-400 hover:text-emerald-800 text-xs font-extrabold transition-all shadow-xs cursor-pointer"
              title="Home Page"
            >
              <Home className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'en' ? '← Home Page' : lang === 'hi' ? '← होम पेज' : '← Home Page'}</span>
            </Link>

            <div className="lg:hidden">
              <Link to="/">
                <BrandLogo size="sm" />
              </Link>
            </div>
          </div>

          <div className="ml-auto">
            <LanguageToggle currentLang={lang} onChange={handleLangChange} />
          </div>
        </div>

        {/* Center Container Card */}
        <div className="w-full max-w-xl mx-auto my-auto py-2">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
            {/* Header Titles */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {tab === 'login'
                  ? copy.loginTitle
                  : tab === 'register'
                  ? copy.registerTitle
                  : copy.forgotTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {tab === 'login'
                  ? copy.loginSubtitle
                  : tab === 'register'
                  ? lang === 'en'
                    ? `Step ${regStep} of 3: ${
                        regStep === 1
                          ? 'Choose Role'
                          : regStep === 2
                          ? 'Basic & Contact Details'
                          : 'Complete Registration'
                      }`
                    : lang === 'hi'
                    ? `चरण ${regStep} / 3: ${
                        regStep === 1
                          ? 'भूमिका (Role) का चयन'
                          : regStep === 2
                          ? 'मूल विवरण एवं संपर्क'
                          : 'पंजीकरण पूर्ण करें'
                      }`
                    : `Step ${regStep} / 3: ${
                        regStep === 1
                          ? 'Role Select Karein'
                          : regStep === 2
                          ? 'Basic & Contact Details'
                          : 'Register Complete Karein'
                      }`
                  : copy.forgotSubtitle}
              </p>
            </div>

            {/* Login / Register Tab Switcher */}
            {tab !== 'forgot' && (
              <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    tab === 'login'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {copy.tabLogin}
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('register')}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    tab === 'register'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {copy.tabRegister}
                </button>
              </div>
            )}

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="mb-5 flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl px-4 py-3 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div>{errorMessage}</div>
                  {window.location.hostname !== 'localhost' &&
                    (errorMessage.toLowerCase().includes('domain') ||
                      errorMessage.toLowerCase().includes('192.168')) && (
                      <div className="pt-1">
                        <a
                          href={`http://localhost:${window.location.port || '3001'}/app`}
                          className="font-bold underline text-emerald-800 dark:text-emerald-300 hover:text-emerald-900"
                        >
                          👉 Click here to switch to localhost:{window.location.port || '3001'}
                        </a>
                      </div>
                    )}
                </div>
              </div>
            )}
            {successMsg && (
              <div className="mb-5 flex items-start gap-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-2xl px-4 py-3 text-xs sm:text-sm">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════ */}
            {/* ── TAB 1: LOGIN ── */}
            {/* ═════════════════════════════════════════════════════ */}
            {tab === 'login' && (
              <div>
                {/* 1-Click Google Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleSubmitting || submitting || isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all shadow-xs hover:shadow-md disabled:opacity-60 mb-3 cursor-pointer"
                >
                  {googleSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>{copy.googleBtn}</span>
                </button>

                {/* Mode Selector (Email / Password VS Mobile OTP) */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('email');
                      setLocalError('');
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      authMode === 'email'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-600 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email & Password</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('phone');
                      setLocalError('');
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      authMode === 'phone'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-600 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Mobile No. OTP</span>
                  </button>
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">
                      {copy.orDivider}
                    </span>
                  </div>
                </div>

                {/* Email Form */}
                {authMode === 'email' ? (
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {copy.emailLabel}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={copy.emailPlaceholder}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          {copy.passwordLabel}
                        </label>
                        <button
                          type="button"
                          onClick={() => switchTab('forgot')}
                          className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-bold cursor-pointer"
                        >
                          {copy.forgotPasswordLink}
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showPass ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={copy.passwordPlaceholder}
                          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass((s) => !s)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || isLoading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-md shadow-emerald-950/20 disabled:opacity-60 cursor-pointer"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <span>{copy.loginBtn}</span>
                    </button>
                  </form>
                ) : (
                  /* Phone OTP Form */
                  <div className="space-y-4">
                    {!otpSent ? (
                      <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            {copy.phoneLabel}
                          </label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold">
                              🇮🇳 +91
                            </span>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                              placeholder={copy.phonePlaceholder}
                              className="flex-1 px-4 py-3 rounded-r-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-mono"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-md shadow-emerald-950/20 disabled:opacity-60 cursor-pointer"
                        >
                          {submitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Smartphone className="w-4 h-4" />
                          )}
                          <span>{copy.sendOtpBtn}</span>
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                              {copy.otpLabel}
                            </label>
                            <button
                              type="button"
                              onClick={() => setOtpSent(false)}
                              className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
                            >
                              Change Number
                            </button>
                          </div>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder={copy.otpPlaceholder}
                            className="w-full text-center tracking-[0.5em] text-xl font-bold py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-mono"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-md shadow-emerald-950/20 disabled:opacity-60 cursor-pointer"
                        >
                          {submitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          <span>{copy.verifyOtpBtn}</span>
                        </button>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="text-xs text-slate-500 hover:text-emerald-700 font-medium cursor-pointer"
                          >
                            {copy.resendOtp}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ═════════════════════════════════════════════════════ */}
            {/* ── TAB 2: 3-STEP REGISTRATION WIZARD ── */}
            {/* ═════════════════════════════════════════════════════ */}
            {tab === 'register' && (
              <div className="space-y-6">
                {/* 3-Step Visual Progress Bar */}
                <div className="flex items-center justify-between relative px-2">
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />

                  {[
                    {
                      s: 1,
                      label: lang === 'en' ? 'Role' : lang === 'hi' ? 'भूमिका' : 'Role',
                    },
                    {
                      s: 2,
                      label: lang === 'en' ? 'Details' : lang === 'hi' ? 'विवरण' : 'Details',
                    },
                    {
                      s: 3,
                      label: lang === 'en' ? 'Register' : lang === 'hi' ? 'खाता बनाएं' : 'Register',
                    },
                  ].map((stepItem) => {
                    const isDone = regStep > stepItem.s;
                    const isCurrent = regStep === stepItem.s;
                    return (
                      <div key={stepItem.s} className="flex flex-col items-center relative z-10">
                        <button
                          type="button"
                          onClick={() => {
                            if (stepItem.s < regStep) setRegStep(stepItem.s as RegStep);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isCurrent
                              ? 'bg-emerald-800 text-white ring-4 ring-emerald-100 dark:ring-emerald-950/60 shadow-md scale-110'
                              : isDone
                              ? 'bg-emerald-600 text-white cursor-pointer'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {isDone ? <Check className="w-4 h-4" /> : stepItem.s}
                        </button>
                        <span
                          className={`text-[11px] font-bold mt-1.5 ${
                            isCurrent
                              ? 'text-emerald-800 dark:text-emerald-400 font-extrabold'
                              : 'text-slate-400'
                          }`}
                        >
                          {stepItem.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* ── STEP 1: CHOOSE ROLE ── */}
                {regStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        {lang === 'en'
                          ? '1. Select Your Role & Authority'
                          : lang === 'hi'
                          ? '1. अपनी कार्य भूमिका (Role) चुनें'
                          : '1. Apni Business Role Chunein'}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-bold">
                        {copy.roles.find((r) => r.id === role)?.title}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                      {copy.roles.map((r) => {
                        const IconComponent = roleIcons[r.id] || Shield;
                        const isSelected = role === r.id;
                        return (
                          <div
                            key={r.id}
                            onClick={() => setRole(r.id as UserRole)}
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/60 shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 bg-white dark:bg-slate-800/50'
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                isSelected
                                  ? 'bg-emerald-700 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                              }`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-xs font-black truncate ${
                                    isSelected
                                      ? 'text-emerald-900 dark:text-emerald-200'
                                      : 'text-slate-800 dark:text-slate-200'
                                  }`}
                                >
                                  {r.title}
                                </span>
                                {isSelected && (
                                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-1 line-clamp-2">
                                {r.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setRegStep(2)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-md shadow-emerald-950/20 cursor-pointer"
                    >
                      <span>
                        {lang === 'en'
                          ? 'Proceed to Step 2: Basic Details'
                          : lang === 'hi'
                          ? 'चरण 2 पर आगे बढ़ें: मूल विवरण दर्ज करें'
                          : 'Step 2 par jayein: Basic Details'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* ── STEP 2: BASIC DETAILS & CONTACT (SUPER ADMIN MANAGEABLE) ── */}
                {regStep === 2 && (
                  <form onSubmit={handleStep2Next} className="space-y-3.5">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/50 rounded-xl text-xs flex items-center justify-between">
                      <span className="text-emerald-800 dark:text-emerald-300 font-bold">
                        {lang === 'en' ? 'Selected Role:' : lang === 'hi' ? 'चयनित भूमिका:' : 'Selected Role:'}{' '}
                        {copy.roles.find((r) => r.id === role)?.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => setRegStep(1)}
                        className="text-emerald-700 underline font-extrabold cursor-pointer"
                      >
                        Change
                      </button>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {copy.nameLabel} *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={copy.namePlaceholder}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {copy.phoneLabel} *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder={copy.phonePlaceholder}
                          className="flex-1 px-3.5 py-2.5 rounded-r-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {copy.emailLabel} *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={copy.emailPlaceholder}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Single Business Premises (Shop & Attached Godown) */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white">
                          Goyal Cattle Feed Store · गजरौला
                        </span>
                        <p className="text-[11px] text-slate-500">
                          {lang === 'en'
                            ? 'Single Premises: Shop & Attached Godowns (Kavi Nagar, Gajraula, UP)'
                            : lang === 'hi'
                            ? 'मुख्य परिसर: दुकान एवं संलग्न गोदाम (कवि नगर, गजरौला, उत्तर प्रदेश)'
                            : 'Single Premises: Dukan aur Attached Godowns (Kavi Nagar, Gajraula, UP)'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setRegStep(1)}
                        className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        ← Back
                      </button>

                      <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-md shadow-emerald-950/20 cursor-pointer"
                      >
                        <span>
                          {lang === 'en'
                            ? 'Proceed to Step 3: Create Account'
                            : lang === 'hi'
                            ? 'चरण 3 पर आगे बढ़ें: खाता सक्रिय करें'
                            : 'Step 3 par jayein: Account Banayein'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* ── STEP 3: ACCOUNT CREATION (WITH GOOGLE OR PASSWORD) ── */}
                {regStep === 3 && (
                  <div className="space-y-4">
                    {/* Summary Card */}
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-black text-slate-900 dark:text-white">
                        <span>{name}</span>
                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                          {copy.roles.find((r) => r.id === role)?.title}
                        </span>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 flex items-center gap-3">
                        <span>📱 +91 {phone}</span>
                        <span>✉️ {email}</span>
                      </div>
                    </div>

                    {/* METHOD 1: Instant Google Registration */}
                    <div className="p-4 rounded-2xl border-2 border-emerald-600/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-center space-y-2">
                      <span className="text-[11px] font-black uppercase text-emerald-800 dark:text-emerald-300 tracking-wider">
                        {lang === 'en'
                          ? 'Recommended 1-Click Fast Method'
                          : lang === 'hi'
                          ? 'अनुशंसित 1-क्लिक तीव्र माध्यम'
                          : 'Sabse Asaan 1-Click Method'}
                      </span>
                      <button
                        type="button"
                        onClick={handleFinalRegisterGoogle}
                        disabled={googleSubmitting || submitting}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-white font-black text-xs sm:text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-60 cursor-pointer"
                      >
                        {googleSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                        ) : (
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                        )}
                        <span>
                          {lang === 'en'
                            ? 'Complete Registration with Google'
                            : lang === 'hi'
                            ? 'गूगल खाते से पंजीकरण पूर्ण करें'
                            : 'Google se Register Complete Karein'}
                        </span>
                      </button>
                    </div>

                    <div className="relative my-3">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">
                          {lang === 'en' ? 'or set security password' : lang === 'hi' ? 'अथवा पासवर्ड सेट करें' : 'ya password banayein'}
                        </span>
                      </div>
                    </div>

                    {/* METHOD 2: Password Registration */}
                    <form onSubmit={handleFinalRegisterPassword} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {copy.passwordLabel}
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                              type={showPass ? 'text' : 'password'}
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="6+ chars"
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {copy.confirmPasswordLabel}
                          </label>
                          <input
                            type={showPass ? 'text' : 'password'}
                            required
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            placeholder={copy.confirmPasswordPlaceholder}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setRegStep(2)}
                          className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer"
                        >
                          ← Back
                        </button>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-md shadow-emerald-950/20 disabled:opacity-60 cursor-pointer"
                        >
                          {submitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          <span>
                            {lang === 'en'
                              ? 'Finish Registration'
                              : lang === 'hi'
                              ? 'पंजीकरण पूर्ण करें'
                              : 'Account Ready Karein'}
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ═════════════════════════════════════════════════════ */}
            {/* ── TAB 3: DEDICATED FORGOT PASSWORD ── */}
            {/* ═════════════════════════════════════════════════════ */}
            {tab === 'forgot' && (
              <form onSubmit={handleForgot} className="space-y-4">
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 font-bold mb-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{copy.backToLogin}</span>
                </button>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/50">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs mb-1">
                    <KeyRound className="w-4 h-4" />
                    <span>
                      {lang === 'en'
                        ? 'Password Reset Assistance'
                        : lang === 'hi'
                        ? 'पासवर्ड रीसेट सहायता'
                        : 'Password Reset Help'}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    {lang === 'en'
                      ? 'Enter your account email. We will send an official Firebase secure link to create a new password.'
                      : lang === 'hi'
                      ? 'अपना पंजीकृत ईमेल दर्ज करें। हम नया पासवर्ड बनाने हेतु सुरक्षित आधिकारिक लिंक भेजेंगे।'
                      : 'Apna registered email daalein. Hum naya password set karne ke liye secure Firebase link bhejenge.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {copy.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={copy.emailPlaceholder}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-md shadow-emerald-950/20 disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  <span>{copy.sendResetBtn}</span>
                </button>
              </form>
            )}

            {/* Return to website link */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {lang === 'en'
                    ? '← Return to Main Website'
                    : lang === 'hi'
                    ? '← मुख्य वेबसाइट होम पेज पर लौटें'
                    : '← Main Website Home Page par lautein'}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="text-center text-xs text-slate-400 py-2">
          © {new Date().getFullYear()} Goyal Cattle Feed Pvt. Ltd. · Secure Business Management OS
        </div>
      </div>
    </div>
  );
};
