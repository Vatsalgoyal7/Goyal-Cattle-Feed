import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { EnterpriseProvider } from './context/EnterpriseContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './components/pages/DashboardPage';
import { UserProfilePage } from './components/pages/UserProfilePage';
import { CompanyProfilePage } from './components/pages/CompanyProfilePage';
import { SettingsPage } from './components/pages/SettingsPage';
import { PlaceholderPage } from './components/pages/PlaceholderPage';

// Part 2 - Fully Functional Enterprise Modules
import { SalesDashboard } from './components/sales/SalesDashboard';
import { PurchaseDashboard } from './components/purchases/PurchaseDashboard';
import { CustomerDashboard } from './components/customers/CustomerDashboard';
import { SupplierDashboard } from './components/suppliers/SupplierDashboard';
import { AccountsDashboard } from './components/accounts/AccountsDashboard';
import { ExpenseDashboard } from './components/expenses/ExpenseDashboard';
import { ReportsDashboard } from './components/reports/ReportsDashboard';

// Part 3 - Inventory, Warehouse, Manufacturing & Operations Modules
import { StockDashboard } from './components/stock/StockDashboard';
import { WarehouseDashboard } from './components/warehouses/WarehouseDashboard';
import { ManufacturingDashboard } from './components/manufacturing/ManufacturingDashboard';
import { EmployeeDashboard } from './components/employees/EmployeeDashboard';
import { TransportDashboard } from './components/transport/TransportDashboard';

// Part 4 – AI Intelligence, Goyal AI Partner & System Modules
import { AIPartnerPage } from './components/ai/AIPartnerPage';
import { AIBillScannerPage } from './components/ai/AIBillScannerPage';
import { AICreativeStudioPage } from './components/ai/AICreativeStudioPage';
import { GoyalConnectPage } from './components/connect/GoyalConnectPage';
import { CloudFilesPage } from './components/files/CloudFilesPage';
import { HardwarePage } from './components/hardware/HardwarePage';
import { NotificationsPage } from './components/system/NotificationsPage';
import { AuditTrailPage } from './components/system/AuditTrailPage';
import { BackupPage } from './components/system/BackupPage';
import { GlobalSearchPage } from './components/system/GlobalSearchPage';

import {
  FileSpreadsheet,
} from 'lucide-react';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <EnterpriseProvider>
          <AppLayout>
            <Routes>
              {/* Part 1: Main Executive Dashboard & Profiles */}
              <Route path="/" element={<DashboardPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/company-profile" element={<CompanyProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Part 2: Sales, Billing, Purchase, Parties & Accounting Modules */}
              <Route path="/sales" element={<SalesDashboard />} />
              <Route path="/purchases" element={<PurchaseDashboard />} />
              <Route path="/customers" element={<CustomerDashboard />} />
              <Route path="/suppliers" element={<SupplierDashboard />} />
              <Route path="/accounts" element={<AccountsDashboard />} />
              <Route path="/expenses" element={<ExpenseDashboard />} />
              <Route path="/reports" element={<ReportsDashboard />} />

              {/* Part 3: Inventory, Warehouse, Manufacturing & Operations Modules */}
              <Route path="/stock" element={<StockDashboard />} />
              <Route path="/warehouses" element={<WarehouseDashboard />} />
              <Route path="/manufacturing" element={<ManufacturingDashboard />} />
              <Route path="/employees" element={<EmployeeDashboard />} />
              <Route path="/transport" element={<TransportDashboard />} />

              {/* Part 4 – Management Placeholder */}
              <Route
                path="/gst-tax"
                element={
                  <PlaceholderPage
                    title="GST & Tax Compliance"
                    category="Management"
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
                }
              />

              {/* Part 4 – AI Intelligence Modules (LIVE) */}
              <Route path="/ai-assistant" element={<AIPartnerPage />} />
              <Route path="/ai-scanner" element={<AIBillScannerPage />} />
              <Route path="/creative-studio" element={<AICreativeStudioPage />} />

              {/* Part 4 – Connect, Files & System Modules (LIVE) */}
              <Route path="/goyal-connect" element={<GoyalConnectPage />} />
              <Route path="/cloud-files" element={<CloudFilesPage />} />
              <Route path="/hardware" element={<HardwarePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/audit" element={<AuditTrailPage />} />
              <Route path="/backup" element={<BackupPage />} />
              <Route path="/global-search" element={<GlobalSearchPage />} />

              {/* Catch-all redirect to Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </EnterpriseProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
