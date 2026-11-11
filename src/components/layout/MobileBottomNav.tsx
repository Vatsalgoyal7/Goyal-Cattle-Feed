import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Receipt,
  Package,
  BookOpen,
  PlusCircle,
} from 'lucide-react';

interface MobileBottomNavProps {
  onQuickActionClick: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onQuickActionClick }) => {
  const { t } = useApp();
  const location = useLocation();

  const navItems = [
    { label: t.dashboard, path: '/', icon: LayoutDashboard },
    { label: 'Sales', path: '/sales', icon: Receipt },
    { label: 'Stock', path: '/stock', icon: Package },
    { label: 'Khata', path: '/accounts', icon: BookOpen },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 flex items-center justify-around">
      {navItems.slice(0, 2).map(item => {
        const IconComp = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors ${
              isActive
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <IconComp className={`w-5 h-5 mb-0.5 ${isActive ? 'text-emerald-700 dark:text-emerald-400' : ''}`} />
            <span className="truncate">{item.label}</span>
          </NavLink>
        );
      })}

      {/* Central Quick Bill / Action Button */}
      <div className="flex-1 flex justify-center">
        <button
          onClick={onQuickActionClick}
          className="-mt-5 w-12 h-12 rounded-full bg-emerald-800 text-white shadow-lg flex items-center justify-center hover:bg-emerald-700 active:scale-95 transition-all ring-4 ring-white dark:ring-slate-900"
          title="Quick Action"
        >
          <PlusCircle className="w-6 h-6 text-white" />
        </button>
      </div>

      {navItems.slice(2, 4).map(item => {
        const IconComp = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors ${
              isActive
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <IconComp className={`w-5 h-5 mb-0.5 ${isActive ? 'text-emerald-700 dark:text-emerald-400' : ''}`} />
            <span className="truncate">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
