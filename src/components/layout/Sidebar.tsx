import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  LayoutDashboard,
  Receipt,
  ShoppingCart,
  Users,
  Building2,
  BookOpen,
  CreditCard,
  Package,
  Warehouse,
  Factory,
  UserCheck,
  Truck,
  FileSpreadsheet,
  BarChart3,
  Sparkles,
  ScanText,
  Palette,
  Share2,
  Cpu,
  Settings,
  ShieldCheck,
  Wheat,
  Bell,
  FolderOpen,
  Shield,
  Database,
  Search,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  LogOut,
  Globe,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

type NavMode = 'icon' | 'list';

interface NavItem {
  label: string;
  labelHi: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavSection {
  title: string;
  titleHi: string;
  color: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const { t, activeRole, language, notifications, userProfile } = useApp();
  const [navMode, setNavMode] = useState<NavMode>('list');
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());
  const location = useLocation();

  const userInitials = (userProfile?.fullName || 'Vatsal Goyal')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navSections: NavSection[] = [
    {
      title: 'Main',
      titleHi: 'मुख्य',
      color: 'bg-slate-500',
      items: [
        { label: 'Dashboard', labelHi: 'डैशबोर्ड', path: '/app/', icon: LayoutDashboard },
        { label: 'Admin Panel', labelHi: 'एडमिन', path: '/app/admin', icon: ShieldCheck },
        { label: 'Website Home', labelHi: 'वेबसाइट होम', path: '/', icon: Globe },
      ],
    },
    {
      title: 'Business',
      titleHi: 'व्यापार',
      color: 'bg-blue-500',
      items: [
        { label: 'Sales', labelHi: 'बिक्री', path: '/app/sales', icon: Receipt },
        { label: 'Purchases', labelHi: 'खरीद', path: '/app/purchases', icon: ShoppingCart },
        { label: 'Customers', labelHi: 'ग्राहक', path: '/app/customers', icon: Users },
        { label: 'Suppliers', labelHi: 'सप्लायर', path: '/app/suppliers', icon: Building2 },
        { label: 'Accounts', labelHi: 'हिसाब', path: '/app/accounts', icon: BookOpen },
        { label: 'Expenses', labelHi: 'खर्च', path: '/app/expenses', icon: CreditCard },
      ],
    },
    {
      title: 'Inventory',
      titleHi: 'स्टॉक',
      color: 'bg-emerald-500',
      items: [
        { label: 'Stock', labelHi: 'सामान', path: '/app/stock', icon: Package },
        { label: 'Warehouses', labelHi: 'गोदाम', path: '/app/warehouses', icon: Warehouse },
        { label: 'Factory', labelHi: 'फैक्ट्री', path: '/app/manufacturing', icon: Factory },
        { label: 'Employees', labelHi: 'कर्मचारी', path: '/app/employees', icon: UserCheck },
        { label: 'Transport', labelHi: 'वाहन', path: '/app/transport', icon: Truck },
      ],
    },
    {
      title: 'Reports',
      titleHi: 'रिपोर्ट',
      color: 'bg-purple-500',
      items: [
        { label: 'GST/Tax', labelHi: 'जीएसटी', path: '/app/gst-tax', icon: FileSpreadsheet },
        { label: 'Reports', labelHi: 'रिपोर्ट', path: '/app/reports', icon: BarChart3 },
      ],
    },
    {
      title: 'AI Tools',
      titleHi: 'AI टूल्स',
      color: 'bg-indigo-500',
      items: [
        { label: 'AI Partner', labelHi: 'AI साथी', path: '/app/ai-assistant', icon: Sparkles },
        { label: 'Scanner', labelHi: 'स्कैनर', path: '/app/ai-scanner', icon: ScanText },
        { label: 'Studio', labelHi: 'स्टूडियो', path: '/app/creative-studio', icon: Palette },
        { label: 'Connect', labelHi: 'कनेक्ट', path: '/app/goyal-connect', icon: Share2 },
      ],
    },
    {
      title: 'System',
      titleHi: 'सिस्टम',
      color: 'bg-slate-500',
      items: [
        { label: 'Alerts', labelHi: 'सूचना', path: '/app/notifications', icon: Bell, badge: unreadCount },
        { label: 'Files', labelHi: 'फ़ाइलें', path: '/app/cloud-files', icon: FolderOpen },
        { label: 'Audit', labelHi: 'ऑडिट', path: '/app/audit', icon: Shield },
        { label: 'Backup', labelHi: 'बैकअप', path: '/app/backup', icon: Database },
        { label: 'Search', labelHi: 'खोज', path: '/app/global-search', icon: Search },
        { label: 'Hardware', labelHi: 'हार्डवेयर', path: '/app/hardware', icon: Cpu },
        { label: 'Settings', labelHi: 'सेटिंग', path: '/app/settings', icon: Settings },
      ],
    },
  ];

  const toggleSection = (idx: number) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleLinkClick = () => {
    if (onMobileClose) onMobileClose();
  };

  const getLabel = (item: NavItem) =>
    language === 'hi' ? item.labelHi : item.label;

  const getSectionTitle = (s: NavSection) =>
    language === 'hi' ? s.titleHi : s.title;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 select-none transition-all duration-300 ease-in-out ${
          navMode === 'icon' ? 'md:w-[88px]' : 'md:w-[260px]'
        } ${
          isMobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <BrandLogo size="sm" variant={navMode === 'icon' && !isMobileOpen ? 'icon' : 'full'} />
          </div>

          {/* Nav Mode Toggle — icon grid vs list */}
          <button
            onClick={() => setNavMode(m => m === 'icon' ? 'list' : 'icon')}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title={navMode === 'icon' ? 'Switch to list view' : 'Switch to icon view'}
          >
            {navMode === 'icon' ? <List className="w-3.5 h-3.5" /> : <Grid className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3 space-y-1">
          {navMode === 'icon' && !isMobileOpen ? (
            /* ── ICON-GRID MODE ── */
            <div className="px-2 space-y-4">
              {navSections.map((section, sIdx) => (
                <div key={sIdx}>
                  {/* Section dot-divider */}
                  <div className="flex items-center gap-1 mb-1.5 px-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${section.color} opacity-70`} />
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {section.items.map(item => {
                      const IconComp = item.icon;
                      const isActive =
                        item.path === '/'
                          ? location.pathname === '/'
                          : location.pathname.startsWith(item.path);
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={handleLinkClick}
                          title={item.label}
                          className={`relative flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all group ${
                            isActive
                              ? 'bg-emerald-800 text-white shadow-sm'
                              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <IconComp
                            className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                              isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          />
                          <span className={`text-[9px] font-semibold leading-tight text-center ${
                            isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {getLabel(item)}
                          </span>
                          {/* Badge */}
                          {item.badge ? (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                              {item.badge > 9 ? '9+' : item.badge}
                            </div>
                          ) : null}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── LIST MODE ── */
            <div className="px-2 space-y-1">
              {navSections.map((section, sIdx) => {
                const isCollapsed = collapsedSections.has(sIdx);
                return (
                  <div key={sIdx} className="mb-2">
                    {/* Section header — collapsible */}
                    <button
                      onClick={() => toggleSection(sIdx)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${section.color}`} />
                        {getSectionTitle(section)}
                      </div>
                      {isCollapsed
                        ? <ChevronDown className="w-3 h-3 opacity-50" />
                        : <ChevronUp className="w-3 h-3 opacity-50" />
                      }
                    </button>

                    {!isCollapsed && (
                      <div className="mt-0.5 space-y-0.5">
                        {section.items.map(item => {
                          const IconComp = item.icon;
                          const isActive =
                            item.path === '/'
                              ? location.pathname === '/'
                              : location.pathname.startsWith(item.path);
                          return (
                            <NavLink
                              key={item.path}
                              to={item.path}
                              onClick={handleLinkClick}
                              className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                                isActive
                                  ? 'bg-emerald-800 text-white shadow-sm font-semibold'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              <IconComp
                                className={`w-4 h-4 shrink-0 ${
                                  isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:scale-105 transition-transform'
                                }`}
                              />
                              <span className="truncate">{getLabel(item)}</span>
                              {item.badge ? (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                  {item.badge > 99 ? '99+' : item.badge}
                                </span>
                              ) : null}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer — user info */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/70 dark:bg-slate-950/40">
          <NavLink
            to="/app/profile"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors group ${
              navMode === 'icon' && !isMobileOpen ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 text-xs font-bold ring-1 ring-emerald-600/30">
              {userInitials}
            </div>
            {(navMode === 'list' || isMobileOpen) && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {userProfile.fullName}
                  </span>
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                </div>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 truncate font-medium">
                  {activeRole}
                </p>
              </div>
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
};
