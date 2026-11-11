import React, { useState, useMemo } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { ProductInventoryItem, ProductCategoryType, InventoryUnit } from '../../types';
import { formatIndianCurrency } from '../../data/sampleData';
import { exportToExcel, exportToCsv, printDocument } from '../../utils/exportUtils';
import {
  Package,
  Boxes,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Search,
  Plus,
  SlidersHorizontal,
  QrCode,
  Barcode,
  RefreshCw,
  Printer,
  FileSpreadsheet,
  Download,
  Eye,
  Edit,
  History,
  CheckCircle2,
  XCircle,
  Truck,
  ShieldAlert,
  ArrowRightLeft,
  X,
  Scan,
} from 'lucide-react';

export const StockDashboard: React.FC = () => {
  const { products, stockMovements, addProduct, updateProduct, adjustStock, warehouses } = useEnterprise();

  const [activeTab, setActiveTab] = useState<'all' | 'raw' | 'finished' | 'packaging' | 'movements' | 'alerts' | 'barcodes'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductInventoryItem | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<ProductInventoryItem | null>(null);
  const [barcodeProduct, setBarcodeProduct] = useState<ProductInventoryItem | null>(null);
  const [viewHistoryProduct, setViewHistoryProduct] = useState<ProductInventoryItem | null>(null);

  // Form states for Add / Edit Product
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Finished Goods' as ProductCategoryType,
    productType: 'Finished' as ProductInventoryItem['productType'],
    hsnCode: '23099010',
    gstRate: 5,
    unit: 'Bags (50kg)' as InventoryUnit,
    purchaseRate: 1400,
    sellingRate: 1680,
    wholesaleRate: 1620,
    retailRate: 1720,
    minimumStock: 300,
    maximumStock: 2000,
    currentStock: 500,
    packageSize: '50 KG Bag',
    description: '',
  });

  // Form state for stock adjustment
  const [adjustmentData, setAdjustmentData] = useState({
    physicalStock: 0,
    reason: 'Monthly physical verification audit',
    location: 'WH-MAIN',
  });

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const rawItems = products.filter(p => p.category === 'Raw Material' || p.category === 'Supplements / Minerals');
    const finishedItems = products.filter(p => p.category === 'Finished Goods');
    const lowStockItems = products.filter(p => p.currentStock <= p.minimumStock && p.currentStock > 0);
    const outOfStockItems = products.filter(p => p.currentStock <= 0);

    const totalStockValue = products.reduce((acc, p) => acc + p.currentStock * p.purchaseRate, 0);
    const rawStockValue = rawItems.reduce((acc, p) => acc + p.currentStock * p.purchaseRate, 0);
    const finishedStockValue = finishedItems.reduce((acc, p) => acc + p.currentStock * p.purchaseRate, 0);

    return {
      totalProducts,
      totalStockValue,
      rawStockValue,
      finishedStockValue,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
    };
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Tab filter
      if (activeTab === 'raw' && p.category !== 'Raw Material' && p.category !== 'Supplements / Minerals') return false;
      if (activeTab === 'finished' && p.category !== 'Finished Goods') return false;
      if (activeTab === 'packaging' && p.category !== 'Packaging Material') return false;
      if (activeTab === 'alerts' && p.currentStock > p.minimumStock) return false;

      // Status filter
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;

      // Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          p.hsnCode.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
        );
      }

      return true;
    });
  }, [products, activeTab, statusFilter, searchTerm]);

  // Filtered Movements
  const filteredMovements = useMemo(() => {
    return stockMovements.filter(m => {
      if (viewHistoryProduct && m.productId !== viewHistoryProduct.id) return false;
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        m.productName.toLowerCase().includes(term) ||
        m.transactionId.toLowerCase().includes(term) ||
        m.referenceNumber.toLowerCase().includes(term) ||
        m.type.toLowerCase().includes(term) ||
        m.sourceLocation.toLowerCase().includes(term) ||
        m.destinationLocation.toLowerCase().includes(term)
      );
    });
  }, [stockMovements, viewHistoryProduct, searchTerm]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `GCF-${Date.now().toString().slice(-4)}`,
      category: 'Finished Goods',
      productType: 'Finished',
      hsnCode: '23099010',
      gstRate: 5,
      unit: 'Bags (50kg)',
      purchaseRate: 1400,
      sellingRate: 1680,
      wholesaleRate: 1620,
      retailRate: 1720,
      minimumStock: 300,
      maximumStock: 2000,
      currentStock: 200,
      packageSize: '50 KG Bag',
      description: '',
    });
    setIsAddProductOpen(true);
  };

  const handleOpenEdit = (prod: ProductInventoryItem) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      sku: prod.sku,
      category: prod.category,
      productType: prod.productType,
      hsnCode: prod.hsnCode,
      gstRate: prod.gstRate,
      unit: prod.unit,
      purchaseRate: prod.purchaseRate,
      sellingRate: prod.sellingRate,
      wholesaleRate: prod.wholesaleRate,
      retailRate: prod.retailRate,
      minimumStock: prod.minimumStock,
      maximumStock: prod.maximumStock,
      currentStock: prod.currentStock,
      packageSize: prod.packageSize || '50 KG Bag',
      description: prod.description,
    });
    setIsAddProductOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        status: formData.currentStock <= 0 ? 'Out of Stock' : formData.currentStock <= formData.minimumStock ? 'Low Stock' : 'In Stock',
      });
    } else {
      addProduct({
        name: formData.name,
        sku: formData.sku,
        barcode: `890601${Date.now().toString().slice(-6)}`,
        qrCode: `GCF-${formData.sku}-2026`,
        category: formData.category,
        productType: formData.productType,
        hsnCode: formData.hsnCode,
        gstRate: Number(formData.gstRate),
        unit: formData.unit,
        purchaseRate: Number(formData.purchaseRate),
        sellingRate: Number(formData.sellingRate),
        wholesaleRate: Number(formData.wholesaleRate),
        retailRate: Number(formData.retailRate),
        minimumStock: Number(formData.minimumStock),
        maximumStock: Number(formData.maximumStock),
        currentStock: Number(formData.currentStock),
        warehouseStock: { 'WH-MAIN': Number(formData.currentStock) },
        packageSize: formData.packageSize,
        status: Number(formData.currentStock) <= Number(formData.minimumStock) ? 'Low Stock' : 'In Stock',
        description: formData.description,
      });
    }

    setIsAddProductOpen(false);
  };

  const handleOpenAdjustment = (prod: ProductInventoryItem) => {
    setAdjustingProduct(prod);
    setAdjustmentData({
      physicalStock: prod.currentStock,
      reason: 'Monthly physical stock verification & audit discrepancy',
      location: 'WH-MAIN',
    });
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;
    adjustStock(
      adjustingProduct.id,
      Number(adjustmentData.physicalStock),
      adjustmentData.reason,
      adjustmentData.location
    );
    setAdjustingProduct(null);
  };

  const handleExportProductsExcel = () => {
    const cols = [
      { header: 'Product ID', key: 'productId' },
      { header: 'Product Name', key: 'name' },
      { header: 'SKU', key: 'sku' },
      { header: 'Category', key: 'category' },
      { header: 'HSN Code', key: 'hsnCode' },
      { header: 'Current Stock', key: 'currentStock' },
      { header: 'Unit', key: 'unit' },
      { header: 'Purchase Rate (₹)', key: 'purchaseRate' },
      { header: 'Selling Rate (₹)', key: 'sellingRate' },
      { header: 'Min Level', key: 'minimumStock' },
      { header: 'Status', key: 'status' },
    ];
    exportToExcel(cols, filteredProducts, `Inventory_Catalog_${Date.now()}`);
  };

  const handleExportMovementsExcel = () => {
    const cols = [
      { header: 'Transaction ID', key: 'transactionId' },
      { header: 'Date', key: 'date' },
      { header: 'Product Name', key: 'productName' },
      { header: 'Type', key: 'type' },
      { header: 'Ref Number', key: 'referenceNumber' },
      { header: 'Source', key: 'sourceLocation' },
      { header: 'Destination', key: 'destinationLocation' },
      { header: 'Quantity In', key: 'quantityIn' },
      { header: 'Quantity Out', key: 'quantityOut' },
      { header: 'Balance', key: 'balance' },
      { header: 'Unit', key: 'unit' },
      { header: 'Created By', key: 'createdBy' },
    ];
    exportToExcel(cols, filteredMovements, `Stock_Ledger_${Date.now()}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Package className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Stock & Inventory Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Goyal Cattle Feed Pvt. Ltd. | Multi-location Finished Feeds, Bulk Grains, Packaging & Movement Ledger
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'movements' ? (
            <button
              onClick={handleExportMovementsExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 transition shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Export Ledger
            </button>
          ) : (
            <button
              onClick={handleExportProductsExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 transition shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Export Catalog
            </button>
          )}

          <button
            onClick={() => printDocument()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print View
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Products</span>
            <Boxes className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
            {metrics.totalProducts} <span className="text-xs font-normal text-slate-400">SKUs</span>
          </div>
          <span className="text-[10px] text-slate-400">Catalogue items</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Stock Value</span>
            <Package className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatIndianCurrency(metrics.totalStockValue)}
          </div>
          <span className="text-[10px] text-slate-400">At purchase cost</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Finished Goods</span>
            <Boxes className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
            {formatIndianCurrency(metrics.finishedStockValue)}
          </div>
          <span className="text-[10px] text-slate-400">Pellet & Mash Bags</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Raw Grains & Meals</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
            {formatIndianCurrency(metrics.rawStockValue)}
          </div>
          <span className="text-[10px] text-slate-400">Silos & bulk grain</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-black text-amber-600 font-mono">
            {metrics.lowStockCount} <span className="text-xs font-normal text-slate-400">Items</span>
          </div>
          <span className="text-[10px] text-amber-500 font-medium">Below reorder safety buffer</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Out of Stock</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-lg font-black text-red-600 font-mono">
            {metrics.outOfStockCount} <span className="text-xs font-normal text-slate-400">Items</span>
          </div>
          <span className="text-[10px] text-slate-400">Zero inventory</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Products' },
              { id: 'finished', label: 'Finished Cattle Feeds' },
              { id: 'raw', label: 'Raw Materials & Grains' },
              { id: 'packaging', label: 'Packaging Supplies' },
              { id: 'movements', label: 'Stock Movement Ledger' },
              { id: 'alerts', label: `Low Stock Alerts (${metrics.lowStockCount})` },
              { id: 'barcodes', label: 'Barcode & QR Generator' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setViewHistoryProduct(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search SKU, name, HSN..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Tab 1, 2, 3, 4, 6: Product Directory Table */}
        {activeTab !== 'movements' && activeTab !== 'barcodes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Product Details</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">HSN Code</th>
                  <th className="p-3 text-right">Purchase Rate</th>
                  <th className="p-3 text-right">Selling Rate</th>
                  <th className="p-3 text-center">Available Stock</th>
                  <th className="p-3 text-right">Stock Valuation</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      No products found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(prod => {
                    const isLow = prod.currentStock <= prod.minimumStock;
                    const stockVal = prod.currentStock * prod.purchaseRate;

                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-3">
                          <div className="font-semibold text-slate-900 dark:text-white">{prod.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            SKU: {prod.sku} · Barcode: {prod.barcode}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            prod.category === 'Finished Goods'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                              : prod.category === 'Raw Material'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-600 dark:text-slate-400">
                          {prod.hsnCode} ({prod.gstRate}% GST)
                        </td>
                        <td className="p-3 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                          ₹{prod.purchaseRate.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          ₹{prod.sellingRate.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`font-mono font-bold text-sm ${isLow ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                            {prod.currentStock.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-sans">{prod.unit}</span>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {formatIndianCurrency(stockVal)}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            prod.status === 'In Stock'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : prod.status === 'Low Stock'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                              : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                          }`}>
                            {prod.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setViewHistoryProduct(prod);
                                setActiveTab('movements');
                              }}
                              title="View Stock Movement Ledger"
                              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                            >
                              <History className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenAdjustment(prod)}
                              title="Audit / Adjust Stock Quantity"
                              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                            >
                              <SlidersHorizontal className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setBarcodeProduct(prod)}
                              title="Generate Barcode / QR Label"
                              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                            >
                              <QrCode className="w-3.5 h-3.5 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(prod)}
                              title="Edit Product Master"
                              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                            >
                              <Edit className="w-3.5 h-3.5 text-emerald-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 5: Stock Movement Ledger */}
        {activeTab === 'movements' && (
          <div>
            {viewHistoryProduct && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                  Showing movement history for: <strong>{viewHistoryProduct.name}</strong> ({viewHistoryProduct.sku})
                </span>
                <button
                  onClick={() => setViewHistoryProduct(null)}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear Filter
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Transaction / Ref</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Movement Type</th>
                    <th className="p-3">Source & Destination</th>
                    <th className="p-3 text-right">In (+)</th>
                    <th className="p-3 text-right">Out (-)</th>
                    <th className="p-3 text-right">Balance</th>
                    <th className="p-3">Logged By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {filteredMovements.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400">
                        No stock movement records found.
                      </td>
                    </tr>
                  ) : (
                    filteredMovements.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-3 whitespace-nowrap text-slate-500 font-mono">{m.date}</td>
                        <td className="p-3">
                          <span className="font-mono font-semibold text-slate-900 dark:text-white block">{m.transactionId}</span>
                          <span className="text-[11px] text-slate-400">Ref: {m.referenceNumber}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-900 dark:text-white">{m.productName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">SKU: {m.sku}</div>
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {m.type}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-600 dark:text-slate-400">
                          <div>From: {m.sourceLocation}</div>
                          <div>To: {m.destinationLocation}</div>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-600">
                          {m.quantityIn > 0 ? `+${m.quantityIn} ${m.unit}` : '-'}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-red-600">
                          {m.quantityOut > 0 ? `-${m.quantityOut} ${m.unit}` : '-'}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {m.balance > 0 ? `${m.balance} ${m.unit}` : '-'}
                        </td>
                        <td className="p-3 text-slate-500 text-[11px]">
                          <div>{m.createdBy}</div>
                          {m.notes && <div className="text-slate-400 italic text-[10px]">{m.notes}</div>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: Barcode & QR Generator Center */}
        {activeTab === 'barcodes' && (
          <div className="p-6 space-y-6">
            <div className="max-w-2xl bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scan className="w-4 h-4 text-emerald-600" />
                Barcode & QR Code Dispatch Scanner (Simulation)
              </h3>
              <p className="text-xs text-slate-500">
                Simulate warehouse camera or handheld wireless laser scanner reading batch labels on 50kg feed bags.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Scan or enter Barcode / QR (e.g. 890601234001 or GCF-PREM-50)..."
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
                <button
                  onClick={() => alert('Scanner simulation: Bag verified! Lot #BATCH-26-889. Product: Goyal Premium Cattle Feed (50kg). Sound packaging verified.')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                >
                  Verify Tag
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">{p.name}</h4>
                      <span className="text-[11px] text-slate-500 font-mono">SKU: {p.sku}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                      ₹{p.sellingRate} MRP
                    </span>
                  </div>

                  {/* Simulated Barcode */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="w-48 h-10 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 flex items-center justify-center text-white text-[10px] tracking-widest font-mono">
                      ||| | |||| | ||||| | ||
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1">{p.barcode}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Package: {p.packageSize || p.unit}</span>
                    <button
                      onClick={() => setBarcodeProduct(p)}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Label
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal 1: Add / Edit Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                {editingProduct ? 'Edit Product Master' : 'Add New Cattle Feed or Raw Material Product'}
              </h2>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Goyal Premium Cattle Feed (50kg)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="Finished Goods">Finished Goods</option>
                    <option value="Raw Material">Raw Material</option>
                    <option value="Packaging Material">Packaging Material</option>
                    <option value="Supplements / Minerals">Supplements / Minerals</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Measurement Unit *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="Bags (50kg)">Bags (50kg)</option>
                    <option value="Bags (25kg)">Bags (25kg)</option>
                    <option value="Quintal">Quintal (100 KG)</option>
                    <option value="Ton">Metric Ton (1,000 KG)</option>
                    <option value="KG">Kilogram (KG)</option>
                    <option value="Piece">Piece / Sacks</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    HSN Code & GST Rate *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.hsnCode}
                      onChange={e => setFormData({ ...formData, hsnCode: e.target.value })}
                      className="w-2/3 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                    <select
                      value={formData.gstRate}
                      onChange={e => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                      className="w-1/3 px-2 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Pricing Tiers (₹ per selected unit)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Purchase Rate</label>
                    <input
                      type="number"
                      value={formData.purchaseRate}
                      onChange={e => setFormData({ ...formData, purchaseRate: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Selling Rate (Standard)</label>
                    <input
                      type="number"
                      value={formData.sellingRate}
                      onChange={e => setFormData({ ...formData, sellingRate: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Wholesale / Dealer</label>
                    <input
                      type="number"
                      value={formData.wholesaleRate}
                      onChange={e => setFormData({ ...formData, wholesaleRate: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Retail Rate</label>
                    <input
                      type="number"
                      value={formData.retailRate}
                      onChange={e => setFormData({ ...formData, retailRate: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Levels */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Opening / Current Stock
                  </label>
                  <input
                    type="number"
                    value={formData.currentStock}
                    onChange={e => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Minimum Stock Buffer
                  </label>
                  <input
                    type="number"
                    value={formData.minimumStock}
                    onChange={e => setFormData({ ...formData, minimumStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Maximum Capacity
                  </label>
                  <input
                    type="number"
                    value={formData.maximumStock}
                    onChange={e => setFormData({ ...formData, maximumStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Product Description & Nutritional Specifications
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 20% Crude Protein cattle feed pellet with roasted maize & organic minerals..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  {editingProduct ? 'Save Modifications' : 'Create Product Entry'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal 2: Stock Adjustment Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                Physical Stock Adjustment Audit
              </h3>
              <button onClick={() => setAdjustingProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4">
              <div>
                <span className="text-xs text-slate-500 block">Product</span>
                <span className="font-bold text-slate-900 dark:text-white">{adjustingProduct.name}</span>
                <span className="text-xs text-slate-400 block font-mono">Current Recorded Book Stock: {adjustingProduct.currentStock} {adjustingProduct.unit}</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Actual Physical Counted Stock ({adjustingProduct.unit}) *
                </label>
                <input
                  type="number"
                  required
                  value={adjustmentData.physicalStock}
                  onChange={e => setAdjustmentData({ ...adjustmentData, physicalStock: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Variance Difference:{' '}
                  <strong className={adjustmentData.physicalStock - adjustingProduct.currentStock >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                    {adjustmentData.physicalStock - adjustingProduct.currentStock >= 0 ? '+' : ''}
                    {adjustmentData.physicalStock - adjustingProduct.currentStock} {adjustingProduct.unit}
                  </strong>
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Warehouse Location *
                </label>
                <select
                  value={adjustmentData.location}
                  onChange={e => setAdjustmentData({ ...adjustmentData, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.code}>{w.name} ({w.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Audited Reason / Justification *
                </label>
                <textarea
                  rows={2}
                  required
                  value={adjustmentData.reason}
                  onChange={e => setAdjustmentData({ ...adjustmentData, reason: e.target.value })}
                  placeholder="e.g. Monthly physical verification audit, moisture evaporation, tearing..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
                >
                  Confirm Audited Adjustment
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal 3: Printable Barcode / QR Label Preview Modal */}
      {barcodeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-center">
            
            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Label & QR</span>
              <button onClick={() => setBarcodeProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Label Card */}
            <div className="p-4 border-2 border-slate-900 rounded-xl space-y-3 bg-white text-slate-900">
              <div className="border-b pb-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-emerald-700">GOYAL CATTLE FEED PVT. LTD.</div>
                <div className="text-xs font-bold text-slate-900">{barcodeProduct.name}</div>
                <div className="text-[10px] text-slate-500">Pack: {barcodeProduct.packageSize || barcodeProduct.unit} · HSN: {barcodeProduct.hsnCode}</div>
              </div>

              {/* Barcode representation */}
              <div className="flex flex-col items-center">
                <div className="w-44 h-12 bg-slate-900 flex items-center justify-center text-white text-[11px] tracking-widest font-mono">
                  |||| | ||||| | ||| |||| |
                </div>
                <span className="text-[10px] font-mono font-bold mt-1">{barcodeProduct.barcode}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold border-t pt-2">
                <span>MRP: ₹{barcodeProduct.sellingRate.toFixed(2)}</span>
                <span className="text-[9px] text-slate-500">Mfd: 11/2026</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => printDocument()}
                className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Thermal Label
              </button>
              <button
                onClick={() => setBarcodeProduct(null)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
