import React, { useState, useMemo } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { formatIndianCurrency } from '../../data/sampleData';
import { exportTableToPdf, exportToExcel, exportToCsv, printDocument } from '../../utils/exportUtils';
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  Search,
  Calendar,
  Filter,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const REPORT_DEFINITIONS = [
  { id: 'daily_sales', name: '1. Daily Sales Report', category: 'Sales' },
  { id: 'monthly_sales', name: '2. Monthly Sales Report', category: 'Sales' },
  { id: 'purchase_summary', name: '3. Raw Material Purchase Report', category: 'Purchase' },
  { id: 'customer_outstanding', name: '4. Customer Outstanding (Receivables)', category: 'Receivables' },
  { id: 'supplier_outstanding', name: '5. Supplier Outstanding (Payables)', category: 'Payables' },
  { id: 'customer_ledger', name: '6. Customer Khata Ledger Report', category: 'Accounts' },
  { id: 'supplier_ledger', name: '7. Supplier Khata Ledger Report', category: 'Accounts' },
  { id: 'cash_book', name: '8. Cash Book Report', category: 'Cash & Bank' },
  { id: 'bank_book', name: '9. Bank Book Report (HDFC)', category: 'Cash & Bank' },
  { id: 'payment_collections', name: '10. Payment Collections Report', category: 'Collections' },
  { id: 'expense_summary', name: '11. Operational Expense Report', category: 'Expenses' },
  { id: 'receivables_aging', name: '12. Debtor Aging Analysis (0-30, 30-60, 60+)', category: 'Receivables' },
  { id: 'payables_aging', name: '13. Creditor Aging Analysis', category: 'Payables' },
  { id: 'gstr1_tax', name: '14. GSTR-1 Sales Tax Summary (B2B & B2C)', category: 'Tax & GST' },
  { id: 'current_stock', name: '15. Current Stock Valuation & Balance Report', category: 'Inventory' },
  { id: 'stock_movement', name: '16. Material Movement Register (FIFO/Batch)', category: 'Inventory' },
  { id: 'warehouse_utilization', name: '17. Multi-Warehouse Capacity & Storage Report', category: 'Warehouse' },
  { id: 'stock_transfers', name: '18. Inter-Warehouse Stock Transfer Challan Report', category: 'Warehouse' },
  { id: 'production_batches', name: '19. Pellet Mill Production & Yield Summary', category: 'Manufacturing' },
  { id: 'quality_inspections', name: '20. QC Quality Inspection & Moisture Lab Report', category: 'Quality' },
  { id: 'employee_muster', name: '21. Staff Attendance & Labour Wage Register', category: 'HR & Labour' },
  { id: 'salary_vouchers', name: '22. Monthly Salary Slip & Advance Deduction Report', category: 'HR & Labour' },
  { id: 'fleet_trips', name: '23. Fleet Vehicle & Goods Dispatch Register', category: 'Logistics' },
  { id: 'weighbridge_log', name: '24. Dharamyanta Weighbridge Inward/Outward Log', category: 'Logistics' },
];

export const ReportsDashboard: React.FC = () => {
  const {
    invoices,
    purchases,
    customers,
    suppliers,
    ledgers,
    expenses,
    payments,
    products,
    warehouses,
    stockMovements,
    transfers,
    productionOrders,
    qualityInspections,
    employees,
    salarySlips,
    vehicles,
    dispatches,
    weighbridgeEntries,
  } = useEnterprise();

  const [activeReportId, setActiveReportId] = useState<string>('daily_sales');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'This Month'>('All');

  const activeReport = REPORT_DEFINITIONS.find(r => r.id === activeReportId) || REPORT_DEFINITIONS[0];

  // Dynamic Dataset & Columns generator based on active report
  const reportData = useMemo(() => {
    switch (activeReportId) {
      case 'daily_sales':
      case 'monthly_sales': {
        const cols = [
          { header: 'Invoice No.', key: 'invoiceNumber' },
          { header: 'Date', key: 'invoiceDate' },
          { header: 'Customer Firm', key: 'customerFirm' },
          { header: 'Doc Type', key: 'documentType' },
          { header: 'Taxable Amt', key: 'taxableAmount' },
          { header: 'CGST', key: 'cgstTotal' },
          { header: 'SGST', key: 'sgstTotal' },
          { header: 'IGST', key: 'igstTotal' },
          { header: 'Total (₹)', key: 'grandTotal' },
          { header: 'Status', key: 'paymentStatus' },
        ];
        const data = invoices.filter(i => {
          if (dateFilter === 'Today') return i.invoiceDate.includes('11/11/2026');
          return true;
        });
        const total = data.reduce((sum, i) => sum + i.grandTotal, 0);
        return { cols, data, totalLabel: 'Total Sales Billed', totalValue: total };
      }

      case 'purchase_summary': {
        const cols = [
          { header: 'Purchase No.', key: 'purchaseNumber' },
          { header: 'Bill No.', key: 'supplierInvoiceNumber' },
          { header: 'Date', key: 'purchaseDate' },
          { header: 'Supplier Firm', key: 'supplierFirm' },
          { header: 'Taxable Amt', key: 'subtotal' },
          { header: 'GST Amt', key: 'totalTax' },
          { header: 'Freight & Loading', key: 'freightCharges' },
          { header: 'Total (₹)', key: 'grandTotal' },
          { header: 'Status', key: 'paymentStatus' },
        ];
        const total = purchases.reduce((sum, p) => sum + p.grandTotal, 0);
        return { cols, data: purchases, totalLabel: 'Total Purchases', totalValue: total };
      }

      case 'customer_outstanding': {
        const cols = [
          { header: 'Customer ID', key: 'customerId' },
          { header: 'Dealer Firm', key: 'firmName' },
          { header: 'Contact Person', key: 'name' },
          { header: 'Phone', key: 'phone' },
          { header: 'Credit Limit', key: 'creditLimit' },
          { header: 'Current Outstanding', key: 'currentOutstanding' },
          { header: 'Last Purchase', key: 'lastPurchaseDate' },
        ];
        const total = customers.reduce((sum, c) => sum + c.currentOutstanding, 0);
        return { cols, data: customers, totalLabel: 'Total Market Receivables', totalValue: total };
      }

      case 'supplier_outstanding': {
        const cols = [
          { header: 'Supplier ID', key: 'supplierId' },
          { header: 'Supplier Firm', key: 'firmName' },
          { header: 'Contact Person', key: 'name' },
          { header: 'Phone', key: 'phone' },
          { header: 'Credit Terms', key: 'creditDays' },
          { header: 'Current Payable', key: 'currentPayable' },
        ];
        const total = suppliers.reduce((sum, s) => sum + s.currentPayable, 0);
        return { cols, data: suppliers, totalLabel: 'Total Supplier Payables', totalValue: total };
      }

      case 'customer_ledger': {
        const cols = [
          { header: 'Date', key: 'date' },
          { header: 'Ref No', key: 'transactionId' },
          { header: 'Customer Name', key: 'partyName' },
          { header: 'Particulars', key: 'particulars' },
          { header: 'Debit (Dr)', key: 'debit' },
          { header: 'Credit (Cr)', key: 'credit' },
          { header: 'Status', key: 'paymentStatus' },
        ];
        const custLedgers = ledgers.filter(l => l.partyType === 'Customer');
        const drTotal = custLedgers.reduce((sum, l) => sum + l.debit, 0);
        return { cols, data: custLedgers, totalLabel: 'Total Debits Billed', totalValue: drTotal };
      }

      case 'supplier_ledger': {
        const cols = [
          { header: 'Date', key: 'date' },
          { header: 'Ref No', key: 'transactionId' },
          { header: 'Supplier Name', key: 'partyName' },
          { header: 'Particulars', key: 'particulars' },
          { header: 'Debit (Dr)', key: 'debit' },
          { header: 'Credit (Cr)', key: 'credit' },
        ];
        const suppLedgers = ledgers.filter(l => l.partyType === 'Supplier');
        const crTotal = suppLedgers.reduce((sum, l) => sum + l.credit, 0);
        return { cols, data: suppLedgers, totalLabel: 'Total Purchases Credited', totalValue: crTotal };
      }

      case 'cash_book': {
        const cols = [
          { header: 'Date', key: 'date' },
          { header: 'Voucher Ref', key: 'transactionId' },
          { header: 'Particulars', key: 'particulars' },
          { header: 'Party', key: 'partyName' },
          { header: 'Cash Inflow (Cr)', key: 'credit' },
          { header: 'Cash Outflow (Dr)', key: 'debit' },
        ];
        const cashEntries = ledgers.filter(l => l.particulars.toLowerCase().includes('cash'));
        const netCash = cashEntries.reduce((sum, l) => sum + (l.credit - l.debit), 0);
        return { cols, data: cashEntries, totalLabel: 'Net Cash Movement', totalValue: netCash };
      }

      case 'bank_book': {
        const cols = [
          { header: 'Date', key: 'date' },
          { header: 'UTR / Ref', key: 'transactionId' },
          { header: 'Particulars', key: 'particulars' },
          { header: 'Party', key: 'partyName' },
          { header: 'Bank Inflow (Cr)', key: 'credit' },
          { header: 'Bank Outflow (Dr)', key: 'debit' },
        ];
        const bankEntries = ledgers.filter(
          l => l.particulars.toLowerCase().includes('bank') || l.particulars.toLowerCase().includes('rtgs')
        );
        const netBank = bankEntries.reduce((sum, l) => sum + (l.credit - l.debit), 0);
        return { cols, data: bankEntries, totalLabel: 'Net Bank Position', totalValue: netBank };
      }

      case 'payment_collections': {
        const cols = [
          { header: 'Payment Ref', key: 'paymentNumber' },
          { header: 'Date', key: 'date' },
          { header: 'Party Firm', key: 'partyFirm' },
          { header: 'Type', key: 'receiptType' },
          { header: 'Mode', key: 'paymentMode' },
          { header: 'Ref / UTR', key: 'transactionRef' },
          { header: 'Amount (₹)', key: 'amount' },
        ];
        const total = payments.reduce((sum, p) => sum + p.amount, 0);
        return { cols, data: payments, totalLabel: 'Total Payments Processed', totalValue: total };
      }

      case 'expense_summary': {
        const cols = [
          { header: 'Expense No', key: 'expenseNumber' },
          { header: 'Date', key: 'expenseDate' },
          { header: 'Category', key: 'category' },
          { header: 'Vendor / Payee', key: 'vendor' },
          { header: 'Description', key: 'description' },
          { header: 'Mode', key: 'paymentMode' },
          { header: 'Amount (₹)', key: 'amount' },
        ];
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);
        return { cols, data: expenses, totalLabel: 'Total Operational Expenses', totalValue: total };
      }

      case 'receivables_aging': {
        const cols = [
          { header: 'Dealer Firm', key: 'firmName' },
          { header: 'Contact', key: 'name' },
          { header: 'Phone', key: 'phone' },
          { header: 'Total Due', key: 'currentOutstanding' },
          { header: '0 - 15 Days', key: 'currentOutstanding' },
          { header: '16 - 30 Days', key: 'creditLimit' },
          { header: '30+ Days (Critical)', key: 'openingBalance' },
        ];
        const total = customers.reduce((sum, c) => sum + c.currentOutstanding, 0);
        return { cols, data: customers, totalLabel: 'Total Aged Receivables', totalValue: total };
      }

      case 'payables_aging': {
        const cols = [
          { header: 'Supplier Firm', key: 'firmName' },
          { header: 'Contact', key: 'name' },
          { header: 'Total Payable', key: 'currentPayable' },
          { header: 'Due in 0-15 Days', key: 'currentPayable' },
          { header: 'Due in 15-30 Days', key: 'openingBalance' },
        ];
        const total = suppliers.reduce((sum, s) => sum + s.currentPayable, 0);
        return { cols, data: suppliers, totalLabel: 'Total Aged Payables', totalValue: total };
      }

      case 'current_stock': {
        const cols = [
          { header: 'Item Code', key: 'code' },
          { header: 'Commodity / Product Name', key: 'name' },
          { header: 'Category', key: 'category' },
          { header: 'Warehouse Location', key: 'warehouse' },
          { header: 'Available Qty', key: 'currentStock' },
          { header: 'Unit', key: 'unit' },
          { header: 'Min Safety Buffer', key: 'minimumStockAlert' },
          { header: 'Valuation Rate (₹)', key: 'purchaseRate' },
          { header: 'Total Value (₹)', key: 'valuation' },
        ];
        const data = products.map(p => ({
          ...p,
          valuation: Math.round(p.currentStock * p.purchaseRate),
        }));
        const total = data.reduce((sum, p) => sum + p.valuation, 0);
        return { cols, data, totalLabel: 'Total Stock Valuation', totalValue: total };
      }

      case 'stock_movement': {
        const cols = [
          { header: 'Date & Time', key: 'timestamp' },
          { header: 'Movement Ref', key: 'movementId' },
          { header: 'Item Name', key: 'productName' },
          { header: 'Type', key: 'movementType' },
          { header: 'Quantity', key: 'quantity' },
          { header: 'Unit', key: 'unit' },
          { header: 'From / To Godown', key: 'destinationWarehouse' },
          { header: 'Batch / Invoice Ref', key: 'referenceDoc' },
        ];
        return { cols, data: stockMovements, totalLabel: 'Total Movement Events', totalValue: stockMovements.length };
      }

      case 'warehouse_utilization': {
        const cols = [
          { header: 'Warehouse Code', key: 'code' },
          { header: 'Facility Name', key: 'name' },
          { header: 'Type', key: 'type' },
          { header: 'Location / Address', key: 'address' },
          { header: 'Capacity (MT)', key: 'capacity' },
          { header: 'Utilization (%)', key: 'currentUtilization' },
          { header: 'Available Space (MT)', key: 'availableSpace' },
          { header: 'Supervisor In-Charge', key: 'manager' },
        ];
        const totalCap = warehouses.reduce((sum, w) => sum + w.capacity, 0);
        return { cols, data: warehouses, totalLabel: 'Total Storage Capacity (MT)', totalValue: totalCap };
      }

      case 'stock_transfers': {
        const cols = [
          { header: 'Transfer Challan No.', key: 'transferNumber' },
          { header: 'Date', key: 'transferDate' },
          { header: 'Source Facility', key: 'sourceWarehouseName' },
          { header: 'Destination Facility', key: 'destinationWarehouseName' },
          { header: 'Product Transferred', key: 'productName' },
          { header: 'Quantity', key: 'qtyDisplay' },
          { header: 'Vehicle / Truck No.', key: 'vehicleNumber' },
          { header: 'Driver Name', key: 'driverName' },
          { header: 'Status', key: 'status' },
        ];
        const data = transfers.map(t => ({
          ...t,
          qtyDisplay: `${t.quantity} ${t.unit}`,
        }));
        return { cols, data, totalLabel: 'Inter-Godown Transfers Logged', totalValue: transfers.length };
      }

      case 'production_batches': {
        const cols = [
          { header: 'Batch Order No.', key: 'orderNumber' },
          { header: 'Batch No.', key: 'batchNumber' },
          { header: 'Pellet Mill Line', key: 'machineLine' },
          { header: 'Recipe Formula', key: 'recipeName' },
          { header: 'Finished Product', key: 'finishedProductName' },
          { header: 'Total Bags', key: 'numberOfBags' },
          { header: 'Input Weight (KG)', key: 'totalInputWeight' },
          { header: 'Output Weight (KG)', key: 'finishedOutputWeight' },
          { header: 'Yield %', key: 'yieldPercent' },
          { header: 'Batch Status', key: 'status' },
        ];
        const data = productionOrders.map(p => ({
          ...p,
          yieldPercent: `${p.yieldPercentage}%`,
        }));
        const totalBags = productionOrders.reduce((sum, p) => sum + p.numberOfBags, 0);
        return { cols, data, totalLabel: 'Total Cattle Feed Bags Produced', totalValue: totalBags };
      }

      case 'quality_inspections': {
        const cols = [
          { header: 'Inspection Ref', key: 'inspectionNumber' },
          { header: 'Date', key: 'date' },
          { header: 'Type / Stage', key: 'type' },
          { header: 'Commodity / Batch', key: 'productName' },
          { header: 'Sample Size', key: 'sampleSize' },
          { header: 'Tested By', key: 'inspector' },
          { header: 'Lab Decision', key: 'overallStatus' },
          { header: 'Quality Remarks', key: 'remarks' },
        ];
        return { cols, data: qualityInspections, totalLabel: 'Total Quality Audits', totalValue: qualityInspections.length };
      }

      case 'employee_muster': {
        const cols = [
          { header: 'Employee ID', key: 'employeeId' },
          { header: 'Full Name', key: 'name' },
          { header: 'Department', key: 'department' },
          { header: 'Designation', key: 'designation' },
          { header: 'Employment Type', key: 'employmentType' },
          { header: 'Salary Type', key: 'salaryType' },
          { header: 'Monthly Salary (₹)', key: 'monthlySalary' },
          { header: 'Daily Wage (₹)', key: 'dailyWage' },
          { header: 'Status', key: 'status' },
        ];
        return { cols, data: employees, totalLabel: 'Active Factory Workforce', totalValue: employees.length };
      }

      case 'salary_vouchers': {
        const cols = [
          { header: 'Salary Slip No.', key: 'slipNumber' },
          { header: 'Staff Name', key: 'employeeName' },
          { header: 'Wage Month', key: 'month' },
          { header: 'Gross Earnings (₹)', key: 'grossEarnings' },
          { header: 'Advance Deducted (₹)', key: 'advanceDeductions' },
          { header: 'PF / ESI Deducted (₹)', key: 'pfEsiDeductions' },
          { header: 'Net Payable (₹)', key: 'netPayable' },
          { header: 'Payment Status', key: 'paymentStatus' },
        ];
        const totalNet = salarySlips.reduce((sum, s) => sum + s.netPayable, 0);
        return { cols, data: salarySlips, totalLabel: 'Total Payroll Disbursed', totalValue: totalNet };
      }

      case 'fleet_trips': {
        const cols = [
          { header: 'Dispatch Order No.', key: 'dispatchNumber' },
          { header: 'Date', key: 'dispatchDate' },
          { header: 'Invoice Ref', key: 'invoiceNumber' },
          { header: 'Destination City', key: 'destinationCity' },
          { header: 'Truck Registration', key: 'vehicleNumber' },
          { header: 'Driver Name', key: 'driverName' },
          { header: 'Loaded Bags', key: 'totalBags' },
          { header: 'Freight Fare (₹)', key: 'freightAmount' },
          { header: 'Delivery Status', key: 'status' },
        ];
        const totalFreight = dispatches.reduce((sum, d) => sum + d.freightAmount, 0);
        return { cols, data: dispatches, totalLabel: 'Total Freight Dispatches', totalValue: totalFreight };
      }

      case 'weighbridge_log': {
        const cols = [
          { header: 'Slip / Parchi No.', key: 'slipNumber' },
          { header: 'Date & Time', key: 'dateTime' },
          { header: 'Truck No.', key: 'vehicleNumber' },
          { header: 'Party / Mandi Firm', key: 'partyName' },
          { header: 'Commodity', key: 'commodity' },
          { header: 'Gross Wt (Kg)', key: 'grossWeight' },
          { header: 'Tare Wt (Kg)', key: 'tareWeight' },
          { header: 'Net Weight (Kg)', key: 'netWeight' },
          { header: 'Weighbridge Fee (₹)', key: 'charges' },
        ];
        const totalNetWeight = weighbridgeEntries.reduce((sum, w) => sum + w.netWeight, 0);
        return { cols, data: weighbridgeEntries, totalLabel: 'Total Net Weight (Kg)', totalValue: totalNetWeight };
      }

      case 'gstr1_tax':
      default: {
        const cols = [
          { header: 'Invoice No.', key: 'invoiceNumber' },
          { header: 'Invoice Date', key: 'invoiceDate' },
          { header: 'Buyer GSTIN', key: 'customerGstin' },
          { header: 'Buyer Legal Name', key: 'customerFirm' },
          { header: 'Place of Supply', key: 'placeOfSupply' },
          { header: 'Taxable Value', key: 'taxableAmount' },
          { header: 'Central Tax (CGST)', key: 'cgstTotal' },
          { header: 'State Tax (SGST)', key: 'sgstTotal' },
          { header: 'Integrated Tax (IGST)', key: 'igstTotal' },
          { header: 'Invoice Value (₹)', key: 'grandTotal' },
        ];
        const total = invoices.reduce((sum, i) => sum + i.grandTotal, 0);
        return { cols, data: invoices, totalLabel: 'Total GSTR-1 Taxable Turnover', totalValue: total };
      }
    }
  }, [
    activeReportId,
    invoices,
    purchases,
    customers,
    suppliers,
    ledgers,
    expenses,
    payments,
    products,
    warehouses,
    stockMovements,
    transfers,
    productionOrders,
    qualityInspections,
    employees,
    salarySlips,
    vehicles,
    dispatches,
    weighbridgeEntries,
    dateFilter,
  ]);

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchTerm) return reportData.data;
    const term = searchTerm.toLowerCase();
    return reportData.data.filter(row => {
      return Object.values(row).some(val =>
        String(val).toLowerCase().includes(term)
      );
    });
  }, [reportData.data, searchTerm]);

  const handleExportExcel = () => {
    exportToExcel(reportData.cols, filteredData, `${activeReportId}_${Date.now()}`);
  };

  const handleExportCsv = () => {
    exportToCsv(reportData.cols, filteredData, `${activeReportId}_${Date.now()}`);
  };

  const handleExportPdf = () => {
    exportTableToPdf(
      activeReport.name.toUpperCase(),
      `Goyal Cattle Feed Pvt. Ltd. | ${reportData.totalLabel}: ₹${reportData.totalValue.toLocaleString('en-IN')}`,
      reportData.cols,
      filteredData,
      `${activeReportId}_${Date.now()}`
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Financial Reports & Business Statements
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Goyal Cattle Feed Pvt. Ltd. | 24 Standard Regulatory, Financial & Factory Operations Reports
          </p>
        </div>

        {/* Unified Export Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 transition shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Excel (.xlsx)
          </button>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>

          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-red-600" />
            PDF
          </button>

          <button
            onClick={() => printDocument()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>

      {/* Report Switcher Carousel */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
          Select Standard Report from Catalog (14 Available):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {REPORT_DEFINITIONS.map(r => (
            <button
              key={r.id}
              onClick={() => setActiveReportId(r.id)}
              className={`p-2.5 rounded-lg border text-left text-xs font-medium transition ${
                activeReportId === r.id
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs ring-1 ring-emerald-500'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="block font-bold truncate">{r.name.split('.')[1].trim()}</span>
              <span className="text-[10px] text-slate-400 block truncate mt-0.5">{r.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Banner for Active Report */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <span className="text-[11px] text-emerald-400 font-semibold block uppercase tracking-wider">
            Active Statement
          </span>
          <h2 className="text-base font-bold text-white">{activeReport.name}</h2>
          <p className="text-xs text-slate-400">
            Category: {activeReport.category} | Records Count: {filteredData.length}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">{reportData.totalLabel}:</span>
          <span className="text-xl font-black text-emerald-400 font-mono">
            {formatIndianCurrency(reportData.totalValue)}
          </span>
        </div>
      </div>

      {/* Report Data Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Period:</span>
            {(['All', 'Today', 'This Month'] as const).map(p => (
              <button
                key={p}
                onClick={() => setDateFilter(p)}
                className={`px-3 py-1 rounded text-xs font-medium transition ${
                  dateFilter === p
                    ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search across columns..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                {reportData.cols.map((col, idx) => (
                  <th key={idx} className="p-3 whitespace-nowrap">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={reportData.cols.length} className="p-8 text-center text-slate-400">
                    No records found for current criteria.
                  </td>
                </tr>
              ) : (
                filteredData.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    {reportData.cols.map((col, cIdx) => {
                      const val = (row as Record<string, any>)[col.key];
                      const isCreditDays = col.key === 'creditDays';
                      const isNumeric = typeof val === 'number';
                      return (
                        <td
                          key={cIdx}
                          className={`p-3 whitespace-nowrap ${
                            isNumeric && !isCreditDays ? 'text-right font-mono font-medium' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isCreditDays
                            ? `${val} Days Net`
                            : isNumeric
                            ? `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                            : String(val !== undefined && val !== null ? val : '-')}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
