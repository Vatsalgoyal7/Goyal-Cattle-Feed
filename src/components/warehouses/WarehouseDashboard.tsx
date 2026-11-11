import React, { useState, useMemo } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { Warehouse, StockTransfer, StockTransferStatus } from '../../types';
import { formatIndianCurrency } from '../../data/sampleData';
import { exportToExcel, printDocument } from '../../utils/exportUtils';
import {
  Warehouse as WarehouseIcon,
  Plus,
  ArrowRightLeft,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Layers,
  MapPin,
  Phone,
  FileSpreadsheet,
  Printer,
  Search,
  X,
  FileText,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const WarehouseDashboard: React.FC = () => {
  const { warehouses, transfers, products, addWarehouse, createStockTransfer, updateStockTransferStatus, vehicles, drivers } = useEnterprise();

  const [activeTab, setActiveTab] = useState<'warehouses' | 'transfers'>('warehouses');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
  const [transferFilter, setTransferFilter] = useState<'all' | 'in_transit' | 'pending' | 'received'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddWarehouseOpen, setIsAddWarehouseOpen] = useState(false);
  const [isCreateTransferOpen, setIsCreateTransferOpen] = useState(false);
  const [viewChallanTransfer, setViewChallanTransfer] = useState<StockTransfer | null>(null);
  const [receiptConfirmTransfer, setReceiptConfirmTransfer] = useState<StockTransfer | null>(null);
  const [receivedQtyInput, setReceivedQtyInput] = useState<number>(0);

  // Add Warehouse Form
  const [warehouseForm, setWarehouseForm] = useState({
    code: `WH-${Date.now().toString().slice(-4)}`,
    name: '',
    type: 'Regional Depot' as Warehouse['type'],
    address: '',
    manager: '',
    phone: '',
    capacity: 1000,
  });

  // Create Transfer Form
  const [transferForm, setTransferForm] = useState({
    sourceWarehouseId: warehouses[0]?.id || '',
    destinationWarehouseId: warehouses[1]?.id || '',
    productId: products[0]?.id || '',
    quantity: 100,
    unit: 'Bags (50kg)',
    vehicleNumber: 'PB-10-CZ-4412',
    driverName: 'Harjit Singh',
    driverPhone: '+91 98760 11223',
    notes: '',
  });

  // Selected Product for transfer to check available stock
  const selectedTransferProduct = useMemo(() => {
    return products.find(p => p.id === transferForm.productId) || products[0];
  }, [products, transferForm.productId]);

  // Selected Warehouse Profile
  const selectedWarehouse = useMemo(() => {
    if (!selectedWarehouseId) return warehouses[0] || null;
    return warehouses.find(w => w.id === selectedWarehouseId) || warehouses[0] || null;
  }, [warehouses, selectedWarehouseId]);

  // Summary KPIs
  const metrics = useMemo(() => {
    const totalWarehouses = warehouses.length;
    const totalCapacity = warehouses.reduce((acc, w) => acc + w.capacity, 0);
    const totalUtilized = warehouses.reduce((acc, w) => acc + w.currentUtilization, 0);
    const totalValuation = warehouses.reduce((acc, w) => acc + w.totalStockValue, 0);
    const activeTransfers = transfers.filter(t => t.status === 'In Transit' || t.status === 'Dispatched').length;

    return {
      totalWarehouses,
      totalCapacity,
      totalUtilized,
      occupancyPercentage: totalCapacity > 0 ? Math.round((totalUtilized / totalCapacity) * 100) : 0,
      totalValuation,
      activeTransfers,
    };
  }, [warehouses, transfers]);

  // Filtered Transfers
  const filteredTransfers = useMemo(() => {
    return transfers.filter(t => {
      if (transferFilter === 'in_transit' && t.status !== 'In Transit' && t.status !== 'Dispatched') return false;
      if (transferFilter === 'pending' && t.status !== 'Pending Approval' && t.status !== 'Draft') return false;
      if (transferFilter === 'received' && t.status !== 'Received') return false;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          t.transferNumber.toLowerCase().includes(term) ||
          t.productName.toLowerCase().includes(term) ||
          t.sourceWarehouseName.toLowerCase().includes(term) ||
          t.destinationWarehouseName.toLowerCase().includes(term) ||
          t.vehicleNumber.toLowerCase().includes(term)
        );
      }

      return true;
    });
  }, [transfers, transferFilter, searchTerm]);

  const handleSaveWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouseForm.name.trim()) return;

    addWarehouse({
      code: warehouseForm.code,
      name: warehouseForm.name,
      type: warehouseForm.type,
      address: warehouseForm.address,
      manager: warehouseForm.manager,
      phone: warehouseForm.phone,
      capacity: Number(warehouseForm.capacity),
      currentUtilization: 0,
      availableSpace: Number(warehouseForm.capacity),
      totalStockValue: 0,
      status: 'Active',
      sections: [
        { id: `sec-${Date.now()}-1`, name: 'Main Stacking Bay', type: 'Floor', capacity: Math.round(warehouseForm.capacity * 0.7), currentStock: 0 },
        { id: `sec-${Date.now()}-2`, name: 'Buffer Storage', type: 'Rack', capacity: Math.round(warehouseForm.capacity * 0.3), currentStock: 0 },
      ],
    });

    setIsAddWarehouseOpen(false);
  };

  const handleCreateTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceWh = warehouses.find(w => w.id === transferForm.sourceWarehouseId);
    const destWh = warehouses.find(w => w.id === transferForm.destinationWarehouseId);
    const prod = products.find(p => p.id === transferForm.productId);

    if (!sourceWh || !destWh || !prod) return;
    if (sourceWh.id === destWh.id) {
      alert('Source and destination warehouse cannot be the same location.');
      return;
    }

    const created = createStockTransfer({
      sourceWarehouseId: sourceWh.id,
      sourceWarehouseName: sourceWh.name,
      destinationWarehouseId: destWh.id,
      destinationWarehouseName: destWh.name,
      transferDate: new Date().toLocaleDateString('en-GB'),
      productId: prod.id,
      productName: prod.name,
      quantity: Number(transferForm.quantity),
      unit: transferForm.unit,
      vehicleNumber: transferForm.vehicleNumber,
      driverName: transferForm.driverName,
      driverPhone: transferForm.driverPhone,
      status: 'In Transit',
      dispatchedQty: Number(transferForm.quantity),
      receivedQty: 0,
      notes: transferForm.notes,
      createdBy: 'Rajesh Goyal (MD)',
    });

    setIsCreateTransferOpen(false);
    setViewChallanTransfer(created);
  };

  const handleConfirmReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptConfirmTransfer) return;
    updateStockTransferStatus(receiptConfirmTransfer.id, 'Received', Number(receivedQtyInput));
    setReceiptConfirmTransfer(null);
  };

  const handleExportTransfersExcel = () => {
    const cols = [
      { header: 'Transfer No.', key: 'transferNumber' },
      { header: 'Date', key: 'transferDate' },
      { header: 'Product', key: 'productName' },
      { header: 'Source Location', key: 'sourceWarehouseName' },
      { header: 'Destination Location', key: 'destinationWarehouseName' },
      { header: 'Qty Dispatched', key: 'dispatchedQty' },
      { header: 'Qty Received', key: 'receivedQty' },
      { header: 'Vehicle No.', key: 'vehicleNumber' },
      { header: 'Driver', key: 'driverName' },
      { header: 'Status', key: 'status' },
    ];
    exportToExcel(cols, filteredTransfers, `Stock_Transfers_${Date.now()}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              <WarehouseIcon className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Warehouses, Silos & Stock Transfers
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Goyal Cattle Feed Pvt. Ltd. | Khanna Main Plant, Karnal Silos, Regional Depots & Inter-Warehouse Transfers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'transfers' && (
            <button
              onClick={handleExportTransfersExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 transition shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Export Transfers
            </button>
          )}

          <button
            onClick={() => printDocument()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Summary
          </button>

          <button
            onClick={() => setIsCreateTransferOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
            New Stock Transfer
          </button>

          <button
            onClick={() => setIsAddWarehouseOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Warehouse
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Warehouses</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
            {metrics.totalWarehouses} <span className="text-xs font-normal text-slate-400">Locations</span>
          </div>
          <span className="text-[10px] text-slate-400">Plants, silos & depots</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Storage Capacity</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {metrics.totalCapacity.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">MT</span>
          </div>
          <span className="text-[10px] text-slate-400">Occupancy: {metrics.occupancyPercentage}% utilized</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Stock Valuation</span>
            <WarehouseIcon className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatIndianCurrency(metrics.totalValuation)}
          </div>
          <span className="text-[10px] text-slate-400">Across all 7 godowns</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active In-Transit</span>
            <Truck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-600 font-mono">
            {metrics.activeTransfers} <span className="text-xs font-normal text-slate-400">Transfers</span>
          </div>
          <span className="text-[10px] text-amber-500 font-medium">Truck consignments on road</span>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'warehouses'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Godown & Silo Profiles ({warehouses.length})
        </button>
        <button
          onClick={() => setActiveTab('transfers')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'transfers'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          Inter-Warehouse Stock Transfers ({transfers.length})
        </button>
      </div>

      {/* VIEW 1: Warehouses Directory & Section Racks */}
      {activeTab === 'warehouses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Warehouse Cards List */}
          <div className="lg:col-span-1 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Storage Locations Directory
            </span>
            {warehouses.map(wh => {
              const occupancy = wh.capacity > 0 ? Math.round((wh.currentUtilization / wh.capacity) * 100) : 0;
              const isSelected = selectedWarehouse?.id === wh.id;

              return (
                <div
                  key={wh.id}
                  onClick={() => setSelectedWarehouseId(wh.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                        {wh.code}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{wh.name}</h3>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{wh.type}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                      {wh.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Occupancy:</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">{occupancy}% ({wh.currentUtilization} / {wh.capacity} MT)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${occupancy > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, occupancy)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Valuation:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {formatIndianCurrency(wh.totalStockValue)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Profile of Selected Warehouse */}
          {selectedWarehouse && (
            <div className="lg:col-span-2 space-y-4">
              
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Selected Storage Profile
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {selectedWarehouse.name}
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {selectedWarehouse.address}
                    </p>
                  </div>
                  <div className="text-right sm:border-l sm:pl-4 border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-400 block">Stock Valuation</span>
                    <span className="text-xl font-black text-emerald-600 font-mono">
                      {formatIndianCurrency(selectedWarehouse.totalStockValue)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/40">
                    <span className="text-[10px] text-slate-400 block uppercase">Manager Incharge</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">{selectedWarehouse.manager}</span>
                    <span className="text-[10px] text-slate-500">{selectedWarehouse.phone}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/40">
                    <span className="text-[10px] text-slate-400 block uppercase">Total Space</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white block mt-0.5">{selectedWarehouse.capacity} MT</span>
                    <span className="text-[10px] text-slate-500">Gross storage</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/40">
                    <span className="text-[10px] text-slate-400 block uppercase">Current Load</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white block mt-0.5">{selectedWarehouse.currentUtilization} MT</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Active inventory</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/40">
                    <span className="text-[10px] text-slate-400 block uppercase">Available Buffer</span>
                    <span className="font-bold font-mono text-blue-600 block mt-0.5">{selectedWarehouse.availableSpace} MT</span>
                    <span className="text-[10px] text-slate-500">Free unallocated</span>
                  </div>
                </div>

                {/* Section / Bin / Silo Breakdown */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    Storage Zones, Bins & Silos ({selectedWarehouse.sections.length} Dedicated Sections)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedWarehouse.sections.map(sec => {
                      const secUtil = sec.capacity > 0 ? Math.round((sec.currentStock / sec.capacity) * 100) : 0;
                      return (
                        <div key={sec.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-xs font-bold text-slate-900 dark:text-white block">{sec.name}</span>
                              <span className="text-[11px] text-slate-500">Type: {sec.type} {sec.commodity && `· ${sec.commodity}`}</span>
                            </div>
                            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border text-slate-700">
                              {secUtil}%
                            </span>
                          </div>

                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, secUtil)}%` }} />
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Stored: <strong>{sec.currentStock} MT</strong></span>
                            <span>Cap: {sec.capacity} MT</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* VIEW 2: Inter-Warehouse Stock Transfers */}
      {activeTab === 'transfers' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filter Transfers:</span>
              {[
                { id: 'all', label: 'All Transfers' },
                { id: 'in_transit', label: 'In Transit / Dispatched' },
                { id: 'pending', label: 'Pending Approval' },
                { id: 'received', label: 'Received' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setTransferFilter(f.id as any)}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    transferFilter === f.id
                      ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search transfer, vehicle, item..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Transfer No.</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Product Transferred</th>
                  <th className="p-3">Source Warehouse</th>
                  <th className="p-3">Destination Warehouse</th>
                  <th className="p-3 text-right">Quantity</th>
                  <th className="p-3">Logistics & Vehicle</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {filteredTransfers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      No stock transfers found for current filter.
                    </td>
                  </tr>
                ) : (
                  filteredTransfers.map(trf => (
                    <tr key={trf.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                        {trf.transferNumber}
                      </td>
                      <td className="p-3 text-slate-500 font-mono">{trf.transferDate}</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        {trf.productName}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">
                        {trf.sourceWarehouseName}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 font-semibold">
                        {trf.destinationWarehouseName}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {trf.quantity} {trf.unit}
                      </td>
                      <td className="p-3">
                        <div className="font-mono text-slate-900 dark:text-white">{trf.vehicleNumber}</div>
                        <div className="text-[11px] text-slate-400">{trf.driverName}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          trf.status === 'Received'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : trf.status === 'In Transit' || trf.status === 'Dispatched'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                        }`}>
                          {trf.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewChallanTransfer(trf)}
                            title="Print Transfer Challan"
                            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                          </button>

                          {(trf.status === 'In Transit' || trf.status === 'Dispatched') && (
                            <button
                              onClick={() => {
                                setReceiptConfirmTransfer(trf);
                                setReceivedQtyInput(trf.quantity);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              Confirm Receipt
                            </button>
                          )}

                          {trf.status === 'Pending Approval' && (
                            <button
                              onClick={() => updateStockTransferStatus(trf.id, 'Dispatched')}
                              className="px-2.5 py-1 text-[11px] font-bold rounded bg-slate-900 hover:bg-slate-800 text-white"
                            >
                              Dispatch Order
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Modal 1: Create Inter-Warehouse Stock Transfer */}
      {isCreateTransferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
                New Inter-Warehouse Stock Transfer Order
              </h3>
              <button onClick={() => setIsCreateTransferOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransferSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Source Warehouse (Origin) *
                  </label>
                  <select
                    value={transferForm.sourceWarehouseId}
                    onChange={e => setTransferForm({ ...transferForm, sourceWarehouseId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Destination Warehouse (Target) *
                  </label>
                  <select
                    value={transferForm.destinationWarehouseId}
                    onChange={e => setTransferForm({ ...transferForm, destinationWarehouseId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Product / Commodity to Transfer *
                </label>
                <select
                  value={transferForm.productId}
                  onChange={e => setTransferForm({ ...transferForm, productId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Available: {p.currentStock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Transfer Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={transferForm.quantity}
                    onChange={e => setTransferForm({ ...transferForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedTransferProduct?.unit || 'Bags (50kg)'}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Transport Fleet Vehicle *
                  </label>
                  <select
                    value={transferForm.vehicleNumber}
                    onChange={e => setTransferForm({ ...transferForm, vehicleNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.vehicleNumber}>{v.vehicleNumber} ({v.type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Driver Name & Contact
                  </label>
                  <input
                    type="text"
                    value={transferForm.driverName}
                    onChange={e => setTransferForm({ ...transferForm, driverName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Transfer Notes & Dispatch Purpose
                </label>
                <textarea
                  rows={2}
                  value={transferForm.notes}
                  onChange={e => setTransferForm({ ...transferForm, notes: e.target.value })}
                  placeholder="e.g. Replenishment for regional farmer demand, silo transfer..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateTransferOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
                >
                  Dispatch & Issue Challan
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal 2: Printable Stock Transfer Challan (Gate Pass) */}
      {viewChallanTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Transfer Delivery Challan</span>
              <button onClick={() => setViewChallanTransfer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Challan Box */}
            <div className="p-5 border-2 border-slate-900 rounded-xl space-y-4 bg-white text-slate-900 text-xs">
              <div className="text-center border-b pb-3">
                <h2 className="text-base font-black tracking-wide text-emerald-800 uppercase">
                  GOYAL CATTLE FEED PVT. LTD.
                </h2>
                <p className="text-[10px] text-slate-600">Grand Trunk Road, Industrial Estate, Khanna, Punjab - 141401 | CIN: U01409PB2018PTC048123</p>
                <div className="mt-2 inline-block px-3 py-0.5 rounded bg-slate-900 text-white font-bold text-[11px] tracking-wider uppercase">
                  STOCK TRANSFER CHALLAN & GATE PASS
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Challan Ref:</span>
                  <strong className="font-mono text-sm">{viewChallanTransfer.transferNumber}</strong>
                  <span className="text-slate-500 block mt-1">Date: {viewChallanTransfer.transferDate}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Transport Carrier:</span>
                  <strong className="font-mono">{viewChallanTransfer.vehicleNumber}</strong>
                  <span className="block text-slate-600">Driver: {viewChallanTransfer.driverName}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg grid grid-cols-2 gap-3 text-[11px] border">
                <div>
                  <span className="text-slate-500 block font-semibold">FROM (Source):</span>
                  <strong>{viewChallanTransfer.sourceWarehouseName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">TO (Destination):</span>
                  <strong>{viewChallanTransfer.destinationWarehouseName}</strong>
                </div>
              </div>

              <table className="w-full border text-left text-xs">
                <thead className="bg-slate-100 font-bold border-b">
                  <tr>
                    <th className="p-2">Item Description</th>
                    <th className="p-2 text-right">Quantity</th>
                    <th className="p-2 text-right">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 font-semibold">{viewChallanTransfer.productName}</td>
                    <td className="p-2 text-right font-mono font-bold">{viewChallanTransfer.quantity}</td>
                    <td className="p-2 text-right font-mono">{viewChallanTransfer.unit}</td>
                  </tr>
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t text-center text-[10px]">
                <div>
                  <div className="border-t border-dashed pt-1 font-bold">Authorized Dispatch Officer</div>
                  <span className="text-slate-400">Khanna Main Plant Gate</span>
                </div>
                <div>
                  <div className="border-t border-dashed pt-1 font-bold">Driver / Receiver Signature</div>
                  <span className="text-slate-400">Goods in sound sealed condition</span>
                </div>
              </div>

            </div>

            <div className="flex gap-2">
              <button
                onClick={() => printDocument()}
                className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Transfer Challan
              </button>
              <button
                onClick={() => setViewChallanTransfer(null)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal 3: Confirm Destination Receipt */}
      {receiptConfirmTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Confirm Stock Arrival & Receipt
              </h3>
              <button onClick={() => setReceiptConfirmTransfer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReceipt} className="space-y-4">
              <div>
                <span className="text-xs text-slate-500 block">Transfer Reference</span>
                <strong className="text-sm font-mono text-slate-900 dark:text-white">{receiptConfirmTransfer.transferNumber}</strong>
                <span className="text-xs text-slate-400 block mt-0.5">
                  {receiptConfirmTransfer.productName} ({receiptConfirmTransfer.quantity} {receiptConfirmTransfer.unit})
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Actual Sound Quantity Received ({receiptConfirmTransfer.unit}) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={receiptConfirmTransfer.quantity}
                  value={receivedQtyInput}
                  onChange={e => setReceivedQtyInput(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Destination Warehouse: <strong>{receiptConfirmTransfer.destinationWarehouseName}</strong>
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setReceiptConfirmTransfer(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Confirm Goods Receipt
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal 4: Add New Warehouse */}
      {isAddWarehouseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Add New Godown / Regional Depot
              </h3>
              <button onClick={() => setIsAddWarehouseOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWarehouse} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Warehouse Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={warehouseForm.code}
                    onChange={e => setWarehouseForm({ ...warehouseForm, code: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Facility Type
                  </label>
                  <select
                    value={warehouseForm.type}
                    onChange={e => setWarehouseForm({ ...warehouseForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  >
                    <option value="Regional Depot">Regional Depot</option>
                    <option value="Finished Goods Godown">Finished Goods Godown</option>
                    <option value="Raw Material Silos">Raw Material Silos</option>
                    <option value="Quarantine">Quarantine Store</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Warehouse Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhatinda Regional Depot"
                  value={warehouseForm.name}
                  onChange={e => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Physical Address
                </label>
                <textarea
                  rows={2}
                  value={warehouseForm.address}
                  onChange={e => setWarehouseForm({ ...warehouseForm, address: e.target.value })}
                  placeholder="e.g. Near New Grain Market, Mansa Road, Bhatinda..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    value={warehouseForm.manager}
                    onChange={e => setWarehouseForm({ ...warehouseForm, manager: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={warehouseForm.phone}
                    onChange={e => setWarehouseForm({ ...warehouseForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Storage Capacity (MT Equivalent)
                </label>
                <input
                  type="number"
                  value={warehouseForm.capacity}
                  onChange={e => setWarehouseForm({ ...warehouseForm, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddWarehouseOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Save Warehouse
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
