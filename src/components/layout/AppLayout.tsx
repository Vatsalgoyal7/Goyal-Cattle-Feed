import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { FloatingCalculator } from '../modals/FloatingCalculator';
import { GlobalSearchModal } from '../modals/GlobalSearchModal';
import { NotificationDrawer } from '../modals/NotificationDrawer';
import { QuickActionModal } from '../modals/QuickActionModal';
import { PaymentManagementModal } from '../payments/PaymentManagementModal';
import { useApp } from '../../context/AppContext';
import { useEnterprise } from '../../context/EnterpriseContext';
import { NavLink } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const GlobalPaymentHost: React.FC = () => {
  const { isRecordPaymentOpen, setIsRecordPaymentOpen } = useEnterprise();
  if (!isRecordPaymentOpen) return null;
  return <PaymentManagementModal onClose={() => setIsRecordPaymentOpen(false)} />;
};

// Floating AI Assistant Button
const FloatingAIButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      to="/app/ai-assistant"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Open Goyal AI Partner"
    >
      <div className="relative flex items-center">
        {/* Label tooltip */}
        {isHovered && (
          <div className="absolute right-14 bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
            Goyal AI Partner
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
          </div>
        )}

        {/* Button */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 ring-2 ring-white dark:ring-slate-800">
          <Sparkles className="w-5 h-5 text-white" />
        </div>

        {/* Pulse animation */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 opacity-30 animate-ping" />
      </div>
    </NavLink>
  );
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setActiveQuickAction } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row antialiased transition-colors">
      {/* Left Sidebar */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <TopHeader onMobileMenuToggle={() => setIsMobileMenuOpen(prev => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        onQuickActionClick={() => setActiveQuickAction('create_sales_bill')}
      />

      {/* Modals & Overlays */}
      <FloatingCalculator />
      <GlobalSearchModal />
      <NotificationDrawer />
      <QuickActionModal />
      <GlobalPaymentHost />

      {/* Floating AI Assistant Button */}
      <FloatingAIButton />
    </div>
  );
};
