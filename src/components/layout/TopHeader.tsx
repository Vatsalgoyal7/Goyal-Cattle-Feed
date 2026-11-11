import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';
import {
  Search,
  Bell,
  Calculator,
  Globe,
  Sun,
  Moon,
  Coffee,
  Wifi,
  WifiOff,
  RefreshCw,
  Menu,
  ChevronDown,
  User,
  Building,
  Settings,
  HelpCircle,
  Sparkles,
  Layers,
  Shield,
  Check,
} from 'lucide-react';
import { UserRole } from '../../types';

interface TopHeaderProps {
  onMobileMenuToggle: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onMobileMenuToggle }) => {
  const {
    t,
    theme,
    setTheme,
    language,
    setLanguage,
    displayMode,
    setDisplayMode,
    connectionStatus,
    triggerManualSync,
    setIsSearchOpen,
    setIsNotificationsOpen,
    setIsCalculatorOpen,
    notifications,
    activeRole,
    setActiveRole,
    userProfile,
  } = useApp();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setIsHelpOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left zone: Mobile hamburger + Global Search Input Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-between w-full max-w-md px-3.5 py-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/60 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors shrink-0" />
            <span className="truncate">{t.searchPlaceholder}</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right zone: Controls & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Simple / Advanced Mode Toggle */}
        <button
          onClick={() => setDisplayMode(displayMode === 'advanced' ? 'simple' : 'advanced')}
          className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            displayMode === 'simple'
              ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700/60'
              : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-200/80'
          }`}
          title="Switch between Simplified touch mode and Advanced ERP mode"
        >
          <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>{displayMode === 'simple' ? t.simpleMode : t.advancedMode}</span>
        </button>

        {/* Connection Status Badge */}
        <div className="relative group">
          <button
            onClick={triggerManualSync}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-colors ${
              connectionStatus === 'online'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                : connectionStatus === 'syncing'
                ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60'
                : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
            }`}
            title="Click to force sync with cloud and local storage"
          >
            {connectionStatus === 'online' ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : connectionStatus === 'syncing' ? (
              <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span className="hidden xl:inline text-[11px]">
              {connectionStatus === 'online'
                ? t.online
                : connectionStatus === 'syncing'
                ? t.syncing
                : t.offline}
            </span>
          </button>
        </div>

        {/* Floating Calculator Toggle */}
        <button
          onClick={() => setIsCalculatorOpen(true)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          title={`${t.calculator} (Alt+C)`}
        >
          <Calculator className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          title="Notification Center"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center gap-1 p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold"
            title="Switch Language (English / हिन्दी / Hinglish)"
          >
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="uppercase text-[11px] font-bold">
              {language === 'hi' ? 'HI' : language === 'hinglish' ? 'HING' : 'EN'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isLangMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs">
              <div className="px-3 py-1 font-semibold text-slate-400 uppercase text-[10px] tracking-wider">
                Select Language
              </div>
              <button
                onClick={() => {
                  setLanguage('en');
                  setIsLangMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  language === 'en' ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>English (International)</span>
                {language === 'en' && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setLanguage('hi');
                  setIsLangMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  language === 'hi' ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>हिन्दी (Devanagari)</span>
                {language === 'hi' && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setLanguage('hinglish');
                  setIsLangMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  language === 'hinglish' ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>Hinglish (Roman Hindi)</span>
                {language === 'hinglish' && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Theme Selector Dropdown */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Theme: Light, Dark, Eye Comfort"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : theme === 'comfort' ? (
              <Coffee className="w-4 h-4 text-amber-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs">
              <div className="px-3 py-1 font-semibold text-slate-400 uppercase text-[10px] tracking-wider">
                Display Theme
              </div>
              <button
                onClick={() => {
                  setTheme('light');
                  setIsThemeMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  theme === 'light' ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" /> Light Mode
              </button>
              <button
                onClick={() => {
                  setTheme('dark');
                  setIsThemeMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  theme === 'dark' ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" /> Dark Mode
              </button>
              <button
                onClick={() => {
                  setTheme('comfort');
                  setIsThemeMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  theme === 'comfort' ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <Coffee className="w-4 h-4 text-amber-600" /> Eye Comfort (Warm)
              </button>
            </div>
          )}
        </div>

        {/* Help / Guide */}
        <div className="relative" ref={helpRef}>
          <button
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Help & ERP Documentation"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {isHelpOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Goyal Business OS Guide
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                Commercial enterprise platform designed for Goyal Cattle Feed Pvt. Ltd. to govern sales, purchases, inventory, accounts, and factory operations.
              </p>
              <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-2 font-mono text-[11px] text-slate-500">
                <div className="flex justify-between">
                  <span>Quick Search:</span> <kbd className="bg-slate-100 dark:bg-slate-800 px-1 rounded">Ctrl+K</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Calculator:</span> <kbd className="bg-slate-100 dark:bg-slate-800 px-1 rounded">Alt+C</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Support Line:</span> <span>+91 1628 238900</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative ml-1 pl-2 border-l border-slate-200 dark:border-slate-800" ref={userRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.fullName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-600/30"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                {userProfile.fullName}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {activeRole.split('/')[0].trim()}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-xs">
              {/* Profile Card Header */}
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {userProfile.fullName}
                </div>
                <div className="text-slate-500 text-[11px]">
                  {userProfile.email}
                </div>
                <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  <Shield className="w-3 h-3" /> {activeRole}
                </div>
              </div>

              {/* Navigation links */}
              <div className="py-1">
                <NavLink
                  to="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{t.userProfile}</span>
                </NavLink>

                <NavLink
                  to="/company-profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>{t.companyProfile}</span>
                </NavLink>

                <NavLink
                  to="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>{t.settings}</span>
                </NavLink>
              </div>

              {/* Demo Role Switcher Section */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-2 pb-1">
                <div className="px-4 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Role (Demo)
                </div>
                <div className="max-h-36 overflow-y-auto px-2 space-y-0.5">
                  {rolesList.map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        setActiveRole(r);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1 rounded text-[11px] transition-colors flex items-center justify-between ${
                        activeRole === r
                          ? 'bg-emerald-700 text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{r}</span>
                      {activeRole === r && <Check className="w-3 h-3 shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
