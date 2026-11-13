import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { EnterpriseProvider } from './context/EnterpriseContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { AuthPage } from './components/auth/AuthPage';
import { ApprovalWaitingScreen } from './components/auth/ApprovalWaitingScreen';
import { CustomizationPanel } from './components/layout/CustomizationPanel';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { SuperAdminPanel } from './components/admin/SuperAdminPanel';
import { DashboardPage } from './components/pages/DashboardPage';
import { UserProfilePage } from './components/pages/UserProfilePage';
import { CompanyProfilePage } from './components/pages/CompanyProfilePage';
import { SettingsPage } from './components/pages/SettingsPage';
import { PlaceholderPage } from './components/pages/PlaceholderPage';

// Part 2
import { SalesDashboard }     from './components/sales/SalesDashboard';
import { PurchaseDashboard }  from './components/purchases/PurchaseDashboard';
import { CustomerDashboard }  from './components/customers/CustomerDashboard';
import { SupplierDashboard }  from './components/suppliers/SupplierDashboard';
import { AccountsDashboard }  from './components/accounts/AccountsDashboard';
import { ExpenseDashboard }   from './components/expenses/ExpenseDashboard';
import { ReportsDashboard }   from './components/reports/ReportsDashboard';

// Part 3
import { StockDashboard }         from './components/stock/StockDashboard';
import { WarehouseDashboard }     from './components/warehouses/WarehouseDashboard';
import { ManufacturingDashboard } from './components/manufacturing/ManufacturingDashboard';
import { EmployeeDashboard }      from './components/employees/EmployeeDashboard';
import { TransportDashboard }     from './components/transport/TransportDashboard';

// Part 4 – AI & System
import { AIPartnerPage }       from './components/ai/AIPartnerPage';
import { AIBillScannerPage }   from './components/ai/AIBillScannerPage';
import { AICreativeStudioPage }from './components/ai/AICreativeStudioPage';
import { GoyalConnectPage }    from './components/connect/GoyalConnectPage';
import { CloudFilesPage }      from './components/files/CloudFilesPage';
import { HardwarePage }        from './components/hardware/HardwarePage';
import { NotificationsPage }   from './components/system/NotificationsPage';
import { AuditTrailPage }      from './components/system/AuditTrailPage';
import { BackupPage }          from './components/system/BackupPage';
import { GlobalSearchPage }    from './components/system/GlobalSearchPage';

import { BrandLogo } from './components/common/BrandLogo';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { FileSpreadsheet } from 'lucide-react';

// ── Fast Loading Screen with Logo ─────────────────────────────
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
    <div className="text-center space-y-4 max-w-sm">
      <BrandLogo size="lg" className="justify-center mx-auto" />
      <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-700 rounded-full animate-spin mx-auto mt-4" />
      <p className="text-xs text-slate-500 font-semibold tracking-wide">
        Goyal Business OS load ho raha hai...
      </p>
    </div>
  </div>
);

// ── Auth-gated inner app layout ──────────────────────────────
const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, appUser } = useAuth();
  const [forceReady, setForceReady] = React.useState(false);

  // Safety timer: Never block user more than 800ms
  React.useEffect(() => {
    const timer = setTimeout(() => setForceReady(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading && !forceReady) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Chakravyuh Security: Unapproved staff must wait for SuperAdmin approval
  const isSuperAdmin = (appUser?.email || '').toLowerCase() === 'vatsalgoyal71@gmail.com' || appUser?.role === 'super_admin' || appUser?.role === 'owner';
  if (appUser && appUser.approvalStatus === 'pending' && !isSuperAdmin) {
    return <ApprovalWaitingScreen />;
  }

  return (
    <AppProvider>
      <EnterpriseProvider>
        <AppLayout>
          <CustomizationPanel />
          <ErrorBoundary fallbackTitle="Module load nahi ho paya">
            <Outlet />
          </ErrorBoundary>
        </AppLayout>
      </EnterpriseProvider>
    </AppProvider>
  );
};

// ── Root App ─────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          {/* Public pages — no auth required */}
          <Route path="/"        element={<HomePage />} />
          <Route path="/about"   element={<AboutPage />} />

          {/* App — auth-gated nested hierarchy */}
          <Route path="/app" element={<AppRoutes />}>
            <Route index                  element={<DashboardPage />} />
            <Route path="profile"         element={<UserProfilePage />} />
            <Route path="company-profile" element={<CompanyProfilePage />} />
            <Route path="settings"        element={<SettingsPage />} />

            {/* Super Admin */}
            <Route path="admin"           element={<SuperAdminPanel />} />

            {/* Business Modules */}
            <Route path="sales"           element={<SalesDashboard />} />
            <Route path="purchases"       element={<PurchaseDashboard />} />
            <Route path="customers"       element={<CustomerDashboard />} />
            <Route path="suppliers"       element={<SupplierDashboard />} />
            <Route path="accounts"        element={<AccountsDashboard />} />
            <Route path="expenses"        element={<ExpenseDashboard />} />
            <Route path="reports"         element={<ReportsDashboard />} />

            {/* Operations & Inventory */}
            <Route path="stock"           element={<StockDashboard />} />
            <Route path="warehouses"      element={<WarehouseDashboard />} />
            <Route path="manufacturing"   element={<ManufacturingDashboard />} />
            <Route path="employees"       element={<EmployeeDashboard />} />
            <Route path="transport"       element={<TransportDashboard />} />

            {/* Compliance */}
            <Route path="gst-tax" element={
              <PlaceholderPage title="GST & Tax Compliance" category="Management"
                description="GSTR-1, GSTR-3B monthly reconciliation, E-Way Bill generation, and TDS compliance tools."
                phase="Part 5 Roadmap"
                plannedFeatures={[
                  'One-click E-Way bill JSON generation and portal integration',
                  'Automated GSTR-1 and GSTR-3B tax summary tables',
                  'HSN code-wise summary and ITC input tax credit audit',
                  'Chartered Accountant export bundle with audit trails',
                ]}
                icon={FileSpreadsheet}
              />
            } />

            {/* Intelligence & System */}
            <Route path="ai-assistant"   element={<AIPartnerPage />} />
            <Route path="ai-scanner"     element={<AIBillScannerPage />} />
            <Route path="creative-studio"element={<AICreativeStudioPage />} />
            <Route path="goyal-connect"  element={<GoyalConnectPage />} />
            <Route path="cloud-files"    element={<CloudFilesPage />} />
            <Route path="hardware"       element={<HardwarePage />} />
            <Route path="notifications"  element={<NotificationsPage />} />
            <Route path="audit"          element={<AuditTrailPage />} />
            <Route path="backup"         element={<BackupPage />} />
            <Route path="global-search"  element={<GlobalSearchPage />} />

            <Route path="*"              element={<Navigate to="/app" replace />} />
          </Route>

          {/* Legacy redirects */}
          <Route path="/dashboard"        element={<Navigate to="/app" replace />} />
          <Route path="/sales"            element={<Navigate to="/app/sales" replace />} />
          <Route path="/purchases"        element={<Navigate to="/app/purchases" replace />} />
          <Route path="/customers"        element={<Navigate to="/app/customers" replace />} />
          <Route path="/suppliers"        element={<Navigate to="/app/suppliers" replace />} />
          <Route path="/accounts"         element={<Navigate to="/app/accounts" replace />} />
          <Route path="/stock"            element={<Navigate to="/app/stock" replace />} />
          <Route path="/warehouses"       element={<Navigate to="/app/warehouses" replace />} />
          <Route path="/employees"        element={<Navigate to="/app/employees" replace />} />
          <Route path="/ai-assistant"     element={<Navigate to="/app/ai-assistant" replace />} />
          <Route path="/admin"            element={<Navigate to="/app/admin" replace />} />

          {/* Catch-all → Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
  );
}
