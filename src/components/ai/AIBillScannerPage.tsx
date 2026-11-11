import React, { useState, useId } from 'react';
import {
  Upload,
  ScanLine,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Trash2,
  RefreshCw,
  Package,
  User,
  Calendar,
  IndianRupee,
  Zap,
  Info,
  FileImage,
  Receipt,
  Search,
  Lock,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { useApp } from '../../context/AppContext';
import { AIDocumentScan, CloudStorageFile } from '../../types';

type ScannerTab = 'Bill Scanner' | 'Expense Scanner' | 'Document Manager' | 'AI Reports';

interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export const AIBillScannerPage: React.FC = () => {
  const {
    scannedDocs,
    addScannedDoc,
    confirmScannedDoc,
    cloudFiles,
    invoices,
    expenses,
    products,
    customers,
  } = useEnterprise();

  const { addActivity } = useApp();

  const [activeTab, setActiveTab] = useState<ScannerTab>('Bill Scanner');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Editable drafts local cache (keyed by document id)
  const [draftEdits, setDraftEdits] = useState<Record<string, Record<string, any>>>({});
  // Local rejected documents list
  const [rejectedDocIds, setRejectedDocIds] = useState<string[]>([]);
  // Preview modal doc
  const [previewDoc, setPreviewDoc] = useState<AIDocumentScan | null>(null);
  const [previewCloudFile, setPreviewCloudFile] = useState<CloudStorageFile | null>(null);

  // Category filter for Document Manager
  const [cloudCategoryFilter, setCloudCategoryFilter] = useState<string>('All');

  // AI Reports state
  const [reportQuery, setReportQuery] = useState('');
  const [activeReportType, setActiveReportType] = useState<
    'sales' | 'customers' | 'low_stock' | 'expenses'
  >('sales');

  const fileInputBillId = useId();
  const fileInputExpenseId = useId();

  // Toast Helper
  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Helper to get active extracted data for a draft
  const getExtractedData = (doc: AIDocumentScan) => {
    return {
      ...doc.extractedData,
      ...(draftEdits[doc.id] || {}),
    };
  };

  const handleFieldChange = (docId: string, field: string, value: any) => {
    setDraftEdits(prev => ({
      ...prev,
      [docId]: {
        ...(prev[docId] || {}),
        [field]: value,
      },
    }));
  };

  // Simulate OCR scan from upload
  const simulateScanUpload = (isExpense = false) => {
    setIsScanning(true);
    setScanProgress(20);

    const timer1 = setTimeout(() => setScanProgress(60), 300);
    const timer2 = setTimeout(() => setScanProgress(95), 650);

    const timer3 = setTimeout(() => {
      setIsScanning(false);
      setScanProgress(0);

      if (isExpense) {
        const newExpenseDoc = addScannedDoc({
          fileName: `Receipt_Fuel_Pump_${Math.floor(1000 + Math.random() * 9000)}.jpg`,
          fileType: 'Receipt',
          category: 'Vehicle Running Expense',
          status: 'Draft Review',
          extractedData: {
            vendorName: 'Bharat Petroleum Highway Outlet, Khanna',
            receiptNumber: `BPC-${Math.floor(10000 + Math.random() * 89999)}`,
            receiptDate: new Date().toLocaleDateString('en-GB'),
            category: 'Transport & Freight',
            amount: 5200,
            litres: 58.5,
            vehicleNumber: 'PB-10-DF-7821',
            paymentMode: 'Cash',
          },
        });
        showToast(
          `Demo OCR extracted fuel receipt: ₹5,200 for PB-10-DF-7821 (${newExpenseDoc.fileName})`,
          'success'
        );
      } else {
        const commodities = [
          { name: 'Yellow Maize (Dry Grain Corn)', rate: 2350, qty: 180 },
          { name: 'Mustard De-Oiled Cake (DOC)', rate: 2850, qty: 120 },
          { name: 'Cottonseed Oil Cake (Binaula Khal)', rate: 3100, qty: 150 },
          { name: 'Rice Bran De-Oiled (DORB)', rate: 1680, qty: 220 },
        ];
        const selected = commodities[Math.floor(Math.random() * commodities.length)];
        const total = selected.rate * selected.qty;

        const newBillDoc = addScannedDoc({
          fileName: `Mandi_Slip_${selected.name.slice(0, 8)}_${Math.floor(1000 + Math.random() * 9000)}.jpg`,
          fileType: 'Invoice',
          category: 'Raw Material Purchase',
          status: 'Draft Review',
          extractedData: {
            supplierName: 'Punjab Agro Mandi Merchant Association',
            supplierGstin: '03AABCP9921D1ZQ',
            invoiceNumber: `MND-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            invoiceDate: new Date().toLocaleDateString('en-GB'),
            commodity: selected.name,
            quantity: selected.qty,
            rate: selected.rate,
            subtotal: total,
            grandTotal: total,
            paymentTerms: '7 Days',
            isDuplicate: false,
          },
        });
        showToast(
          `Demo OCR extracted bill: ${selected.name} (${selected.qty} Qtl @ ₹${selected.rate})`,
          'success'
        );
      }
    }, 950);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  // Confirm Purchase Draft
  const handleSavePurchase = (doc: AIDocumentScan) => {
    const currentData = getExtractedData(doc);
    // Mutate in-place so confirmScannedDoc reads updated user edits
    Object.assign(doc.extractedData, currentData);

    confirmScannedDoc(doc.id, 'Purchase');
    addActivity(
      'Confirmed Scanned Purchase Bill',
      `Saved ${doc.fileName} (${currentData.commodity || 'Goods'} - ₹${(currentData.grandTotal || currentData.subtotal || 0).toLocaleString('en-IN')}) into Purchase Register`,
      'Purchase'
    );
    showToast(`Bill "${doc.fileName}" saved to Purchases successfully!`, 'success');
  };

  // Confirm Expense Draft
  const handleSaveExpense = (doc: AIDocumentScan) => {
    const currentData = getExtractedData(doc);
    Object.assign(doc.extractedData, currentData);

    confirmScannedDoc(doc.id, 'Expense');
    addActivity(
      'Confirmed Scanned Receipt Expense',
      `Saved ${doc.fileName} (${currentData.vendorName || 'Vendor'} - ₹${(currentData.amount || 0).toLocaleString('en-IN')}) into Expense Register`,
      'Accounts'
    );
    showToast(`Receipt "${doc.fileName}" saved to Expenses successfully!`, 'success');
  };

  // Reject doc
  const handleReject = (doc: AIDocumentScan) => {
    setRejectedDocIds(prev => [...prev, doc.id]);
    showToast(`Document "${doc.fileName}" rejected and archived.`, 'info');
  };

  // Filter bills & receipts
  const billDocs = scannedDocs.filter(d => d.fileType !== 'Receipt');
  const receiptDocs = scannedDocs.filter(d => d.fileType === 'Receipt');

  // Categories for Document Manager
  const cloudCategories = [
    'All',
    'Certificates',
    'Quality Reports',
    'Product Images',
    'Transport',
    'Employee KYC',
    'Invoices',
  ];

  const filteredCloudFiles = cloudFiles.filter(file => {
    const matchesCat = cloudCategoryFilter === 'All' || file.category === cloudCategoryFilter;
    const matchesQuery =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Export report as CSV
  const handleExportCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filename}.csv successfully!`, 'success');
  };

  // Report Data Calculations
  // 1. Monthly Sales Report
  const salesByMonth = invoices.reduce<Record<string, { count: number; subtotal: number; tax: number; total: number }>>(
    (acc, inv) => {
      const month = inv.invoiceDate ? inv.invoiceDate.slice(3) : 'Recent';
      if (!acc[month]) acc[month] = { count: 0, subtotal: 0, tax: 0, total: 0 };
      acc[month].count += 1;
      acc[month].subtotal += inv.taxableAmount || inv.subtotal || 0;
      acc[month].tax += (inv.cgstTotal || 0) + (inv.sgstTotal || 0) + (inv.igstTotal || 0);
      acc[month].total += inv.grandTotal || 0;
      return acc;
    },
    {}
  );

  // 2. Top 10 Customers
  const sortedCustomers = [...customers]
    .sort((a, b) => (b.totalPurchases || b.totalSales || 0) - (a.totalPurchases || a.totalSales || 0))
    .slice(0, 10);

  // 3. Low Stock Items
  const lowStockProducts = products.filter(
    p => p.currentStock <= (p.minimumStock || p.minStockLevel || 100)
  );

  // 4. Expenses Breakdown
  const expenseByCategory = expenses.reduce<Record<string, { count: number; total: number; vendor: string }>>(
    (acc, exp) => {
      const cat = exp.category || 'General';
      if (!acc[cat]) acc[cat] = { count: 0, total: 0, vendor: exp.vendor };
      acc[cat].count += 1;
      acc[cat].total += exp.amount || 0;
      return acc;
    },
    {}
  );
  const totalExpenseVal = Object.values(expenseByCategory).reduce((sum, e) => sum + e.total, 0);

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border text-xs font-medium transition-all ${
              t.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : t.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : t.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">{t.message}</div>
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <ScanLine className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                AI Bill & Document Scanner
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Demo Mode
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated OCR extraction for Mandi grain purchase slips, fuel receipts, lab reports & AI reports
              </p>
            </div>
          </div>
        </div>

        {/* Global 4-Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-center overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('Bill Scanner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'Bill Scanner'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Bill Scanner
            {billDocs.filter(d => d.status === 'Draft Review' && !rejectedDocIds.includes(d.id)).length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold inline-flex items-center justify-center">
                {billDocs.filter(d => d.status === 'Draft Review' && !rejectedDocIds.includes(d.id)).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('Expense Scanner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'Expense Scanner'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            Expense Scanner
            {receiptDocs.filter(d => d.status === 'Draft Review' && !rejectedDocIds.includes(d.id)).length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold inline-flex items-center justify-center">
                {receiptDocs.filter(d => d.status === 'Draft Review' && !rejectedDocIds.includes(d.id)).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('Document Manager')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'Document Manager'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileImage className="w-3.5 h-3.5" />
            Document Manager
          </button>

          <button
            onClick={() => setActiveTab('AI Reports')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'AI Reports'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Reports
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: BILL SCANNER
      ========================================================================== */}
      {activeTab === 'Bill Scanner' && (
        <div className="space-y-6">
          {/* Demo Mode OCR Banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 shadow-xs">
            <Info className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold flex items-center gap-2">
                Demo Mode – OCR API not configured
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-200/60 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-semibold">
                  Sample Data Simulation Active
                </span>
              </p>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                Optical character recognition (Tesseract / Google Document AI) is currently in demonstration mode. Uploading documents or selecting test samples simulates automated field extraction with 96.4% confidence score.
              </p>
            </div>
          </div>

          {/* Large Drag-Drop Upload Zone */}
          <div className="p-8 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 text-center relative overflow-hidden transition-all hover:border-emerald-500 shadow-xs">
            {isScanning && (
              <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 z-10">
                <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mb-3" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Scanning Document with OCR AI Engine...
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Detecting table columns, supplier tax headers, commodity quantities and rates
                </p>
                <div className="w-64 bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-4 overflow-hidden">
                  <div
                    className="bg-emerald-700 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-xs">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Drag & Drop Mandi Purchase Slips or Supplier Bills
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Supports JPEG, PNG, TIFF & PDF invoice scans up to 25 MB
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => simulateScanUpload(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  Load Sample Mandi Bill
                </button>
                <label
                  htmlFor={fileInputBillId}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Browse Files
                </label>
                <input
                  id={fileInputBillId}
                  type="file"
                  className="hidden"
                  accept="image/*,application/pdf"
                  onChange={() => simulateScanUpload(false)}
                />
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  <AlertTriangle className="w-3 h-3" />
                  Demo Mode – OCR API not configured
                </span>
              </div>
            </div>
          </div>

          {/* Scanned Bills Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                Scanned Purchase Bills ({billDocs.length})
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {billDocs.filter(d => d.status === 'Draft Review' && !rejectedDocIds.includes(d.id)).length} Pending Review
              </span>
            </div>

            {/* Bills List Grid */}
            <div className="grid grid-cols-1 gap-4">
              {billDocs.map(doc => {
                const isRejected = rejectedDocIds.includes(doc.id) || doc.status === 'Rejected';
                const isConfirmed = doc.status === 'Confirmed' && !isRejected;
                const isDraft = doc.status === 'Draft Review' && !isRejected;
                const data = getExtractedData(doc);
                const quantity = Number(data.quantity || 0);
                const rate = Number(data.rate || 0);
                const calculatedTotal = quantity * rate;

                return (
                  <div
                    key={doc.id}
                    className={`rounded-2xl border p-5 transition-all shadow-xs ${
                      isConfirmed
                        ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800'
                        : isRejected
                        ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                        : 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800/80 ring-1 ring-amber-300/40'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isConfirmed
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : isRejected
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                              {doc.fileName}
                            </h3>
                            {isDraft && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                Draft Review
                              </span>
                            )}
                            {isConfirmed && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Confirmed & Recorded
                              </span>
                            )}
                            {isRejected && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-rose-600" />
                                Rejected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" /> {doc.uploadDate}
                            </span>
                            <span>•</span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                              OCR Accuracy: 96.8% (Demo)
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Slip
                        </button>
                      </div>
                    </div>

                    {/* Editable Review Card (For Draft Review) */}
                    {isDraft && (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                          <div>
                            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400" /> Supplier Name
                            </label>
                            <input
                              type="text"
                              value={data.supplierName || ''}
                              onChange={e => handleFieldChange(doc.id, 'supplierName', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-emerald-700 outline-none"
                              placeholder="Supplier Name"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                              <FileText className="w-3 h-3 text-slate-400" /> Invoice Number
                            </label>
                            <input
                              type="text"
                              value={data.invoiceNumber || ''}
                              onChange={e => handleFieldChange(doc.id, 'invoiceNumber', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-medium focus:ring-1 focus:ring-emerald-700 outline-none"
                              placeholder="e.g. AGM/2026/0881"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" /> Date
                            </label>
                            <input
                              type="text"
                              value={data.invoiceDate || ''}
                              onChange={e => handleFieldChange(doc.id, 'invoiceDate', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-emerald-700 outline-none"
                              placeholder="DD/MM/YYYY"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                              <Package className="w-3 h-3 text-slate-400" /> Commodity
                            </label>
                            <input
                              type="text"
                              value={data.commodity || ''}
                              onChange={e => handleFieldChange(doc.id, 'commodity', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-emerald-700 outline-none"
                              placeholder="Commodity"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                              Quantity (Quintal / Bags)
                            </label>
                            <input
                              type="number"
                              value={quantity || ''}
                              onChange={e =>
                                handleFieldChange(doc.id, 'quantity', parseFloat(e.target.value) || 0)
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-medium focus:ring-1 focus:ring-emerald-700 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                              Rate (₹)
                            </label>
                            <input
                              type="number"
                              value={rate || ''}
                              onChange={e =>
                                handleFieldChange(doc.id, 'rate', parseFloat(e.target.value) || 0)
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-medium focus:ring-1 focus:ring-emerald-700 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                              <IndianRupee className="w-3 h-3 text-slate-400" /> Total
                            </label>
                            <div className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 font-bold font-mono">
                              ₹{(calculatedTotal || data.grandTotal || 0).toLocaleString('en-IN')}
                            </div>
                          </div>

                          <div className="flex items-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleSavePurchase(doc)}
                              className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Save as Purchase
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(doc)}
                              className="py-1.5 px-3 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 font-bold text-xs transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Confirmed Bill Summary */}
                    {isConfirmed && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block">Supplier</span>
                          <span className="font-bold text-slate-900 dark:text-white">{data.supplierName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block">Transaction Ref</span>
                          <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300">
                            {data.invoiceNumber || 'BILL-AUTO'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block">Commodity</span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {data.commodity} ({data.quantity} Qtl)
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block">Total Booked</span>
                          <span className="font-bold font-mono text-emerald-800 dark:text-emerald-300">
                            ₹{(data.grandTotal || data.subtotal || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: EXPENSE SCANNER
      ========================================================================== */}
      {activeTab === 'Expense Scanner' && (
        <div className="space-y-6">
          {/* Demo Mode Banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 shadow-xs">
            <Info className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold flex items-center gap-2">
                Demo Mode – OCR API not configured
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-200/60 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-semibold">
                  Expense OCR Demo
                </span>
              </p>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                Receipts from petrol pumps, highway toll plazas, machine repair workshops, and transport freight are extracted automatically using smart receipt heuristics.
              </p>
            </div>
          </div>

          {/* Upload Zone */}
          <div className="p-8 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 text-center relative overflow-hidden transition-all hover:border-emerald-500 shadow-xs">
            {isScanning && (
              <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 z-10">
                <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mb-3" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Scanning Thermal Slip with AI Vision...
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Parsing fuel litres, pump merchant name, cash/card receipt totals
                </p>
              </div>
            )}

            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-xs">
                <Receipt className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Drag & Drop Fuel, Toll, Repair or Office Receipts
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Thermal paper receipts, petrol bills, weighing slips, and maintenance vouchers
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => simulateScanUpload(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  Load Sample Fuel Receipt
                </button>
                <label
                  htmlFor={fileInputExpenseId}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Upload Receipt
                </label>
                <input
                  id={fileInputExpenseId}
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={() => simulateScanUpload(true)}
                />
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  <AlertTriangle className="w-3 h-3" />
                  Demo Mode – OCR API not configured
                </span>
              </div>
            </div>
          </div>

          {/* Expense Receipts List */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              Scanned Expense Receipts ({receiptDocs.length})
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {receiptDocs.map(doc => {
                const isRejected = rejectedDocIds.includes(doc.id) || doc.status === 'Rejected';
                const isConfirmed = doc.status === 'Confirmed' && !isRejected;
                const isDraft = doc.status === 'Draft Review' && !isRejected;
                const data = getExtractedData(doc);

                return (
                  <div
                    key={doc.id}
                    className={`rounded-2xl border p-5 transition-all shadow-xs ${
                      isConfirmed
                        ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800'
                        : isRejected
                        ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                        : 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800/80 ring-1 ring-amber-300/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isConfirmed
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                              {doc.fileName}
                            </h3>
                            {isDraft && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                Draft Review
                              </span>
                            )}
                            {isConfirmed && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Confirmed as Expense
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {doc.uploadDate}
                            </span>
                            <span>•</span>
                            <span>Category: {data.category || 'Expense'}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 self-start sm:self-center"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </button>
                    </div>

                    {/* Editable fields */}
                    {isDraft && (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                          <div>
                            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400" /> Vendor
                            </label>
                            <input
                              type="text"
                              value={data.vendorName || ''}
                              onChange={e => handleFieldChange(doc.id, 'vendorName', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-emerald-700 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                              <IndianRupee className="w-3 h-3 text-slate-400" /> Amount
                            </label>
                            <input
                              type="number"
                              value={data.amount || ''}
                              onChange={e =>
                                handleFieldChange(doc.id, 'amount', parseFloat(e.target.value) || 0)
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-medium focus:ring-1 focus:ring-emerald-700 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                              <Package className="w-3 h-3 text-slate-400" /> Category
                            </label>
                            <select
                              value={data.category || 'Transport & Freight'}
                              onChange={e => handleFieldChange(doc.id, 'category', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-emerald-700 outline-none"
                            >
                              <option value="Transport & Freight">Transport & Freight</option>
                              <option value="Vehicle Running Expense">Vehicle Fuel / Diesel</option>
                              <option value="Machinery Maintenance">Machinery Maintenance</option>
                              <option value="Loading & Labour">Loading & Labour</option>
                              <option value="Office & Administration">Office & Administration</option>
                              <option value="Electricity & Power">Electricity & Power</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" /> Date
                            </label>
                            <input
                              type="text"
                              value={data.receiptDate || ''}
                              onChange={e => handleFieldChange(doc.id, 'receiptDate', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-emerald-700 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                              Payment Mode
                            </label>
                            <select
                              value={data.paymentMode || 'Cash'}
                              onChange={e => handleFieldChange(doc.id, 'paymentMode', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-emerald-700 outline-none"
                            >
                              <option value="Cash">Cash</option>
                              <option value="UPI">UPI</option>
                              <option value="Company Fuel Card">Company Fuel Card</option>
                              <option value="Bank Transfer">Bank Transfer</option>
                              <option value="Cheque">Cheque</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleReject(doc)}
                            className="py-1.5 px-4 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 font-bold text-xs transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveExpense(doc)}
                            className="py-1.5 px-5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Save as Expense
                          </button>
                        </div>
                      </div>
                    )}

                    {isConfirmed && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block">Vendor</span>
                          <span className="font-bold text-slate-900 dark:text-white">{data.vendorName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block">Category</span>
                          <span className="font-medium text-slate-900 dark:text-white">{data.category}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block">Payment Mode</span>
                          <span className="font-medium text-slate-900 dark:text-white">{data.paymentMode}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block">Amount</span>
                          <span className="font-bold font-mono text-emerald-800 dark:text-emerald-300">
                            ₹{(data.amount || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: DOCUMENT MANAGER
      ========================================================================== */}
      {activeTab === 'Document Manager' && (
        <div className="space-y-6">
          {/* Storage Usage Bar Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                  Storage Usage
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    50 Files Limit
                  </span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">
                  {cloudFiles.length} / 50 files used ({Math.round((cloudFiles.length / 50) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-800 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(cloudFiles.length / 50) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Encrypted enterprise document store for plant compliance licenses, FSSAI certificates & quality audits.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <button
                type="button"
                onClick={() =>
                  showToast(
                    'Demo Mode: Document upload simulation active. Real cloud storage not configured.',
                    'info'
                  )
                }
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload File (Demo)
              </button>
            </div>
          </div>

          {/* Category Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {cloudCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCloudCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    cloudCategoryFilter === cat
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search documents by name or user..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-700 outline-none"
              />
            </div>
          </div>

          {/* Files List Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Upload Date</th>
                    <th className="py-3 px-4">Uploaded By</th>
                    <th className="py-3 px-4">Status / Privacy</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredCloudFiles.map(file => (
                    <tr
                      key={file.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                            {file.mimeType?.includes('pdf') ? (
                              <FileText className="w-4 h-4 text-rose-600" />
                            ) : (
                              <FileImage className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {file.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {file.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {file.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {file.size}
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {file.uploadDate}
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {file.uploadedBy}
                      </td>

                      <td className="py-3 px-4">
                        {file.isPrivate ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                            <Lock className="w-2.5 h-2.5" />
                            Private
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                            <Globe className="w-2.5 h-2.5" />
                            Public
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewCloudFile(file)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Preview Document"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              showToast(
                                `Demo Mode: Cannot download "${file.name}". Real cloud storage URL not configured.`,
                                'warning'
                              )
                            }
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Download File (Demo Mode)"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              showToast(
                                `Demo Mode: Delete request recorded for ${file.name}.`,
                                'info'
                              )
                            }
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                            title="Delete File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCloudFiles.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                        No documents found matching the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: AI REPORTS
      ========================================================================== */}
      {activeTab === 'AI Reports' && (
        <div className="space-y-6">
          {/* Natural Language Query Bar */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              <label className="text-xs font-bold text-slate-900 dark:text-white">
                Goyal Business Intelligence Query
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={reportQuery}
                  onChange={e => setReportQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const lower = reportQuery.toLowerCase();
                      if (lower.includes('customer') || lower.includes('client')) setActiveReportType('customers');
                      else if (lower.includes('stock') || lower.includes('shortage') || lower.includes('inventory'))
                        setActiveReportType('low_stock');
                      else if (lower.includes('expense') || lower.includes('kharcha'))
                        setActiveReportType('expenses');
                      else setActiveReportType('sales');
                      showToast(`AI Report query executed: "${reportQuery}"`, 'success');
                    }
                  }}
                  placeholder="e.g. September ki sales report dikhao"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const lower = reportQuery.toLowerCase();
                  if (lower.includes('customer') || lower.includes('client')) setActiveReportType('customers');
                  else if (lower.includes('stock') || lower.includes('shortage')) setActiveReportType('low_stock');
                  else if (lower.includes('expense') || lower.includes('kharcha')) setActiveReportType('expenses');
                  else setActiveReportType('sales');
                  showToast(`Generated report for: "${reportQuery || 'Sales Overview'}"`, 'success');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Run AI Query
              </button>
            </div>

            {/* Pre-built report buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Pre-built Reports:
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveReportType('sales');
                  showToast('Loaded Monthly Sales Report', 'info');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeReportType === 'sales'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Monthly Sales Report
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveReportType('customers');
                  showToast('Loaded Top 10 Customers', 'info');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeReportType === 'customers'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Top 10 Customers
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveReportType('low_stock');
                  showToast('Loaded Low Stock Report', 'info');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeReportType === 'low_stock'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Low Stock Report ({lowStockProducts.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveReportType('expenses');
                  showToast('Loaded Expense Breakdown', 'info');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeReportType === 'expenses'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Expense Breakdown
              </button>
            </div>
          </div>

          {/* Report Display Container */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-4">
            {/* Report Header & Export Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white capitalize flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                  {activeReportType === 'sales' && 'Monthly Sales Report'}
                  {activeReportType === 'customers' && 'Top 10 Customers'}
                  {activeReportType === 'low_stock' && 'Low Stock Report'}
                  {activeReportType === 'expenses' && 'Expense Breakdown'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Generated in real-time from active Goyal Business OS ledger records
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    showToast('PDF export requires print-ready server', 'warning')
                  }
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (activeReportType === 'sales') {
                      handleExportCSV(
                        'Monthly_Sales_Report',
                        ['Month', 'Invoice Count', 'Taxable Subtotal (INR)', 'GST Total (INR)', 'Grand Total (INR)'],
                        Object.entries(salesByMonth).map(([month, d]) => [
                          month,
                          d.count,
                          d.subtotal,
                          d.tax,
                          d.total,
                        ])
                      );
                    } else if (activeReportType === 'customers') {
                      handleExportCSV(
                        'Top_10_Customers',
                        ['Firm Name', 'Contact Person', 'City', 'Phone', 'Total Sales (INR)', 'Current Outstanding (INR)'],
                        sortedCustomers.map(c => [
                          c.firmName,
                          c.name,
                          c.city,
                          c.phone,
                          c.totalPurchases || c.totalSales || 0,
                          c.currentOutstanding || 0,
                        ])
                      );
                    } else if (activeReportType === 'low_stock') {
                      handleExportCSV(
                        'Low_Stock_Report',
                        ['Product Name', 'SKU', 'Category', 'Current Stock', 'Buffer Level', 'Deficit'],
                        lowStockProducts.map(p => [
                          p.name,
                          p.sku,
                          p.category,
                          p.currentStock,
                          p.minimumStock || p.minStockLevel || 100,
                          (p.minimumStock || p.minStockLevel || 100) - p.currentStock,
                        ])
                      );
                    } else {
                      handleExportCSV(
                        'Expense_Breakdown_Report',
                        ['Category', 'Transaction Count', 'Total Spent (INR)', 'Top Vendor'],
                        Object.entries(expenseByCategory).map(([cat, d]) => [
                          cat,
                          d.count,
                          d.total,
                          d.vendor,
                        ])
                      );
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download CSV
                </button>
              </div>
            </div>

            {/* Table Display */}
            <div className="overflow-x-auto">
              {activeReportType === 'sales' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3 text-right">Invoices</th>
                      <th className="py-2.5 px-3 text-right">Taxable Subtotal</th>
                      <th className="py-2.5 px-3 text-right">GST Total</th>
                      <th className="py-2.5 px-3 text-right">Grand Total</th>
                      <th className="py-2.5 px-3 text-right">Avg Bill Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {Object.entries(salesByMonth).map(([month, data]) => (
                      <tr key={month} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{month}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{data.count} bills</td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          ₹{data.subtotal.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                          ₹{data.tax.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800 dark:text-emerald-400">
                          ₹{data.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                          ₹{Math.round(data.total / (data.count || 1)).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeReportType === 'customers' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Customer Firm</th>
                      <th className="py-2.5 px-3">Contact Person</th>
                      <th className="py-2.5 px-3">City / Phone</th>
                      <th className="py-2.5 px-3 text-right">Total Sales</th>
                      <th className="py-2.5 px-3 text-right">Outstanding</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sortedCustomers.map((cust, idx) => (
                      <tr key={cust.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          {cust.firmName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{cust.name}</td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {cust.city} • {cust.phone}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800 dark:text-emerald-400">
                          ₹{(cust.totalPurchases || cust.totalSales || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-700 dark:text-amber-400">
                          ₹{(cust.currentOutstanding || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              cust.status === 'Active'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                            }`}
                          >
                            {cust.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeReportType === 'low_stock' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Current Stock</th>
                      <th className="py-2.5 px-3 text-right">Minimum Stock</th>
                      <th className="py-2.5 px-3 text-right">Deficit</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {lowStockProducts.map(prod => {
                      const min = prod.minimumStock || prod.minStockLevel || 100;
                      const deficit = min - prod.currentStock;
                      return (
                        <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 px-3 font-mono text-slate-500">{prod.sku}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                            {prod.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">{prod.category}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                            {prod.currentStock} {prod.unit}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                            {min} {prod.unit}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-700 dark:text-amber-400">
                            {deficit > 0 ? `-${deficit} ${prod.unit}` : 'Adequate'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                              Low Stock
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {activeReportType === 'expenses' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                      <th className="py-2.5 px-3">Expense Category</th>
                      <th className="py-2.5 px-3 text-right">Transactions</th>
                      <th className="py-2.5 px-3 text-right">Total Amount</th>
                      <th className="py-2.5 px-3 text-right">% of Total</th>
                      <th className="py-2.5 px-3">Top Payee / Vendor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {Object.entries(expenseByCategory).map(([cat, data]) => {
                      const pct = totalExpenseVal > 0 ? (data.total / totalExpenseVal) * 100 : 0;
                      return (
                        <tr key={cat} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{cat}</td>
                          <td className="py-2.5 px-3 text-right font-mono">{data.count}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800 dark:text-emerald-400">
                            ₹{data.total.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                            {pct.toFixed(1)}%
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{data.vendor}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Slip Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-800" />
                OCR Document Inspector
              </h3>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">File:</span>
                <span className="font-bold text-slate-900 dark:text-white">{previewDoc.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold">{previewDoc.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Upload Date:</span>
                <span>{previewDoc.uploadDate}</span>
              </div>
            </div>

            {/* Extracted JSON Inspector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                Extracted OCR Payload (Normalized Key-Values)
              </label>
              <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 text-[11px] font-mono overflow-x-auto max-h-56">
                {JSON.stringify(getExtractedData(previewDoc), null, 2)}
              </pre>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cloud File Preview Modal */}
      {previewCloudFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileImage className="w-4 h-4 text-emerald-800" />
                Cloud Document Details
              </h3>
              <button
                type="button"
                onClick={() => setPreviewCloudFile(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-2 text-xs">
              <p className="font-bold text-slate-900 dark:text-white">{previewCloudFile.name}</p>
              <p className="text-slate-500">Category: {previewCloudFile.category}</p>
              <p className="text-slate-500">Uploaded by: {previewCloudFile.uploadedBy}</p>
              <p className="text-slate-500">File Size: {previewCloudFile.size}</p>
              <p className="text-slate-500">Uploaded on: {previewCloudFile.uploadDate}</p>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
              Demo Mode: File is encrypted in local simulation memory. Real S3 / R2 storage bucket integration required for binary download.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewCloudFile(null)}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBillScannerPage;
