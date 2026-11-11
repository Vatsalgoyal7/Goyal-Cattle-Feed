import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
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
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Wheat,
  Bell,
  FolderOpen,
  Shield,
  Database,
  Search,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const { t, activeRole } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navSections = [
    {
      title: t.navMain,
      items: [
        { label: t.dashboard, path: '/', icon: LayoutDashboard },
      ],
    },
    {
      title: t.navBusiness,
      items: [
        { label: t.salesBilling, path: '/sales', icon: Receipt },
        { label: t.purchaseManagement, path: '/purchases', icon: ShoppingCart },
        { label: t.customers, path: '/customers', icon: Users },
        { label: t.suppliers, path: '/suppliers', icon: Building2 },
        { label: t.accountsKhata, path: '/accounts', icon: BookOpen },
        { label: t.expenses, path: '/expenses', icon: CreditCard },
      ],
    },
    {
      title: t.navInventory,
      items: [
        { label: t.stockInventory, path: '/stock', icon: Package },
        { label: t.warehouses, path: '/warehouses', icon: Warehouse },
        { label: t.manufacturing, path: '/manufacturing', icon: Factory },
        { label: t.employeesLabour, path: '/employees', icon: UserCheck },
        { label: t.transportVehicles, path: '/transport', icon: Truck },
      ],
    },
    {
      title: t.navManagement,
      items: [
        { label: t.gstTax, path: '/gst-tax', icon: FileSpreadsheet },
        { label: t.reportsAnalytics, path: '/reports', icon: BarChart3 },
      ],
    },
    {
      title: t.navIntelligence,
      items: [
        { label: t.aiBusinessAssistant, path: '/ai-assistant', icon: Sparkles },
        { label: t.aiDocumentScanner, path: '/ai-scanner', icon: ScanText },
        { label: t.creativeStudio, path: '/creative-studio', icon: Palette },
        { label: t.goyalConnect, path: '/goyal-connect', icon: Share2 },
      ],
    },
    {
      title: t.navSystem,
      items: [
        { label: 'Notifications', path: '/notifications', icon: Bell },
        { label: 'Cloud Files', path: '/cloud-files', icon: FolderOpen },
        { label: 'Audit Trail', path: '/audit', icon: Shield },
        { label: 'Backup & Recovery', path: '/backup', icon: Database },
        { label: 'Global Search', path: '/global-search', icon: Search },
        { label: t.hardwareDevices, path: '/hardware', icon: Cpu },
        { label: t.settings, path: '/settings', icon: Settings },
      ],
    },
  ];

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen flex flex-col transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 select-none ${
          /* Desktop width toggle */
          isCollapsed ? 'md:w-[76px]' : 'md:w-[272px]'
        } ${
          /* Mobile drawer state */
          isMobileOpen ? 'translate-x-0 w-[272px]' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs ring-1 ring-emerald-700/50">
              <Wheat className="w-5 h-5 text-amber-300" />
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 dark:text-white tracking-tight text-sm truncate">
                    GOYAL BUSINESS OS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
                  Goyal Cattle Feed Pvt. Ltd.
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {(!isCollapsed || isMobileOpen) && (
                <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  {section.title}
                </div>
              )}

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
                    title={isCollapsed && !isMobileOpen ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <IconComp
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-500 dark:text-slate-400 group-hover:scale-105'
                      }`}
                    />

                    {(!isCollapsed || isMobileOpen) && (
                      <span className="truncate">{item.label}</span>
                    )}

                    {/* Collapsed tooltip */}
                    {isCollapsed && !isMobileOpen && (
                      <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Active Role and Profile Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/70 dark:bg-slate-950/40">
          <NavLink
            to="/profile"
            onClick={handleLinkClick}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 text-xs font-bold ring-1 ring-emerald-600/30">
              RG
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    Rajesh Goyal
                  </span>
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 truncate font-medium">
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
