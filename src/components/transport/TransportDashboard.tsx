import React, { useState, useMemo } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { Vehicle, Driver, DispatchOrder, WeighbridgeEntry, VehicleType, DispatchStatus } from '../../types';
import { formatIndianCurrency } from '../../data/sampleData';
import { calculateWeighbridgeNet } from '../../utils/manufacturingCalculations';
import { exportToExcel, printDocument } from '../../utils/exportUtils';
import {
  Truck,
  Scale,
  Users,
  Send,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileSpreadsheet,
  X,
  FileText,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const TransportDashboard: React.FC = () => {
  const {
    vehicles,
    drivers,
    dispatches,
    weighbridgeEntries,
    addVehicle,
    addDriver,
    createDispatch,
    updateDispatchStatus,
    createWeighbridgeEntry,
    invoices,
  } = useEnterprise();

  const [activeTab, setActiveTab] = useState<'dispatches' | 'weighbridge' | 'vehicles' | 'drivers'>('dispatches');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isNewDispatchOpen, setIsNewDispatchOpen] = useState(false);
  const [isNewWeighbridgeOpen, setIsNewWeighbridgeOpen] = useState(false);
  const [printableChallan, setPrintableChallan] = useState<DispatchOrder | null>(null);
  const [printableSlip, setPrintableSlip] = useState<WeighbridgeEntry | null>(null);

  // Add Vehicle Form
  const [vehicleForm, setVehicleForm] = useState({
    vehicleNumber: '',
    type: 'Truck (10-Tyre)' as VehicleType,
    ownership: 'Company Owned' as Vehicle['ownership'],
    driverName: 'Harjit Singh',
    driverPhone: '+91 98760 11223',
    capacityMT: 16,
    capacityBags: 320,
    fuelType: 'Diesel' as Vehicle['fuelType'],
    rcNumber: 'RC-PB10-2026-9912',
    insuranceExpiry: '15/03/2027',
    fitnessExpiry: '20/04/2027',
    permitExpiry: '10/06/2028',
    status: 'Available' as Vehicle['status'],
    mileageKmPerLitre: 4.5,
  });

  // Add Driver Form
  const [driverForm, setDriverForm] = useState({
    name: '',
    phone: '',
    licenceNumber: '',
    licenceExpiry: '15/06/2030',
    assignedVehicleNumber: 'PB-10-CZ-4412',
    address: '',
    status: 'Active' as Driver['status'],
  });

  // New Dispatch Form
  const [dispatchForm, setDispatchForm] = useState({
    salesInvoiceId: invoices[0]?.id || '',
    destinationCity: 'Ludhiana, Punjab',
    deliveryAddress: 'Main Grain Market, Shop 14, Ludhiana',
    productSummary: '80 Bags Goyal Premium Feed (50kg)',
    totalBags: 80,
    totalWeightMT: 4.0,
    vehicleNumber: 'PB-10-CZ-4412',
    driverName: 'Harjit Singh',
    driverPhone: '+91 98760 11223',
    expectedDeliveryDate: '11/11/2026',
    freightAmount: 2400,
    deliveryNotes: '',
  });

  // Selected Invoice for Dispatch
  const selectedDispatchInvoice = useMemo(() => {
    return invoices.find(i => i.id === dispatchForm.salesInvoiceId) || invoices[0];
  }, [invoices, dispatchForm.salesInvoiceId]);

  // New Weighbridge Form
  const [weighbridgeForm, setWeighbridgeForm] = useState({
    vehicleNumber: 'PB-10-CZ-4412',
    driverName: 'Harjit Singh',
    partyType: 'Supplier' as WeighbridgeEntry['partyType'],
    partyName: 'Aggarwal Grain Millers & Traders',
    commodity: 'Yellow Maize Grain (Bulk Loose)',
    grossWeight: 32500,
    tareWeight: 8500,
    referenceNumber: 'PUR/2026/0192',
    operatorName: 'Sohan Lal (Dharamyanta Operator)',
    charges: 150,
    remarks: 'Gross scale verification at main plant entry.',
  });

  // Live net weight calculation in weighbridge modal
  const liveWeighbridgeCalc = useMemo(() => {
    return calculateWeighbridgeNet(weighbridgeForm.grossWeight, weighbridgeForm.tareWeight);
  }, [weighbridgeForm.grossWeight, weighbridgeForm.tareWeight]);

  // Metrics
  const metrics = useMemo(() => {
    const totalVehicles = vehicles.length;
    const inTransitDispatches = dispatches.filter(d => d.status === 'In Transit' || d.status === 'Dispatched').length;
    const totalDispatchedBags = dispatches.reduce((acc, d) => acc + d.totalBags, 0);
    const weighbridgeCount = weighbridgeEntries.length;

    return {
      totalVehicles,
      inTransitDispatches,
      totalDispatchedBags,
      weighbridgeCount,
    };
  }, [vehicles, dispatches, weighbridgeEntries]);

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.vehicleNumber.trim()) return;
    addVehicle({ ...vehicleForm });
    setIsAddVehicleOpen(false);
  };

  const handleSaveDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverForm.name.trim()) return;
    addDriver({ ...driverForm });
    setIsAddDriverOpen(false);
  };

  const handleSaveDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispatchInvoice) return;

    const created = createDispatch({
      salesInvoiceId: selectedDispatchInvoice.id,
      invoiceNumber: selectedDispatchInvoice.invoiceNumber,
      customerName: selectedDispatchInvoice.customerName,
      customerFirm: selectedDispatchInvoice.customerFirm,
      destinationCity: dispatchForm.destinationCity,
      deliveryAddress: dispatchForm.deliveryAddress,
      productSummary: dispatchForm.productSummary,
      totalBags: Number(dispatchForm.totalBags),
      totalWeightMT: Number(dispatchForm.totalWeightMT),
      vehicleNumber: dispatchForm.vehicleNumber,
      driverName: dispatchForm.driverName,
      driverPhone: dispatchForm.driverPhone,
      dispatchDate: new Date().toLocaleDateString('en-GB'),
      expectedDeliveryDate: dispatchForm.expectedDeliveryDate,
      freightAmount: Number(dispatchForm.freightAmount),
      status: 'In Transit',
      deliveryNotes: dispatchForm.deliveryNotes,
    });

    setIsNewDispatchOpen(false);
    setPrintableChallan(created);
  };

  const handleSaveWeighbridge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveWeighbridgeCalc.valid) {
      alert(liveWeighbridgeCalc.error || 'Invalid weights');
      return;
    }

    const created = createWeighbridgeEntry({
      dateTime: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      vehicleNumber: weighbridgeForm.vehicleNumber,
      driverName: weighbridgeForm.driverName,
      partyType: weighbridgeForm.partyType,
      partyName: weighbridgeForm.partyName,
      commodity: weighbridgeForm.commodity,
      grossWeight: Number(weighbridgeForm.grossWeight),
      tareWeight: Number(weighbridgeForm.tareWeight),
      netWeight: liveWeighbridgeCalc.netKg,
      unit: 'KG',
      referenceNumber: weighbridgeForm.referenceNumber,
      operatorName: weighbridgeForm.operatorName,
      charges: Number(weighbridgeForm.charges),
      remarks: weighbridgeForm.remarks,
    });

    setIsNewWeighbridgeOpen(false);
    setPrintableSlip(created);
  };

  const handleExportDispatchesExcel = () => {
    const cols = [
      { header: 'Dispatch No.', key: 'dispatchNumber' },
      { header: 'Invoice No.', key: 'invoiceNumber' },
      { header: 'Customer Firm', key: 'customerFirm' },
      { header: 'Destination', key: 'destinationCity' },
      { header: 'Bags', key: 'totalBags' },
      { header: 'Weight (MT)', key: 'totalWeightMT' },
      { header: 'Vehicle', key: 'vehicleNumber' },
      { header: 'Driver', key: 'driverName' },
      { header: 'Status', key: 'status' },
    ];
    exportToExcel(cols, dispatches, `Dispatches_${Date.now()}`);
  };

  const handleExportWeighbridgeExcel = () => {
    const cols = [
      { header: 'Slip No.', key: 'slipNumber' },
      { header: 'Date/Time', key: 'dateTime' },
      { header: 'Vehicle', key: 'vehicleNumber' },
      { header: 'Party Name', key: 'partyName' },
      { header: 'Commodity', key: 'commodity' },
      { header: 'Gross Weight (KG)', key: 'grossWeight' },
      { header: 'Tare Weight (KG)', key: 'tareWeight' },
      { header: 'Net Weight (KG)', key: 'netWeight' },
      { header: 'Operator', key: 'operatorName' },
    ];
    exportToExcel(cols, weighbridgeEntries, `Weighbridge_Logs_${Date.now()}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Truck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Transport, Fleet Logistics & Weighbridge
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Goyal Cattle Feed Pvt. Ltd. | Customer Deliveries, Fleet Trucks, Drivers & Electronic Dharamyanta Weighbridge
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'weighbridge' ? (
            <button
              onClick={handleExportWeighbridgeExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 transition shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Export Weigh Logs
            </button>
          ) : (
            <button
              onClick={handleExportDispatchesExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 transition shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Export Dispatches
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
            onClick={() => setIsNewWeighbridgeOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            Weighbridge Entry
          </button>

          <button
            onClick={() => setIsNewDispatchOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            Dispatch Order
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Fleet Vehicles</span>
            <Truck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
            {metrics.totalVehicles} <span className="text-xs font-normal text-slate-400">Trucks</span>
          </div>
          <span className="text-[10px] text-slate-400">Company & hired carriers</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">In-Transit Deliveries</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-600 font-mono">
            {metrics.inTransitDispatches} <span className="text-xs font-normal text-slate-400">Consignments</span>
          </div>
          <span className="text-[10px] text-amber-500 font-medium">Out on regional dealer routes</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Dispatched Volume</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {metrics.totalDispatchedBags} <span className="text-xs font-normal text-slate-400">Bags</span>
          </div>
          <span className="text-[10px] text-slate-400">Total feed bags sent out</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Weighbridge Slips</span>
            <Scale className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {metrics.weighbridgeCount} <span className="text-xs font-normal text-slate-400">Slips</span>
          </div>
          <span className="text-[10px] text-slate-400">Gross & tare audits</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'dispatches', label: 'Dispatch & Delivery Tracking', icon: Send },
          { id: 'weighbridge', label: 'Weighbridge (Dharamyanta)', icon: Scale },
          { id: 'vehicles', label: 'Fleet Vehicle Directory', icon: Truck },
          { id: 'drivers', label: 'Licensed Drivers', icon: Users },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Dispatch & Delivery Tracking */}
      {activeTab === 'dispatches' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b">
                <tr>
                  <th className="p-3">Dispatch No.</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer Firm</th>
                  <th className="p-3">Destination City</th>
                  <th className="p-3">Product Summary</th>
                  <th className="p-3 text-right">Bags / Weight</th>
                  <th className="p-3">Vehicle & Driver</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {dispatches.map(dsp => (
                  <tr key={dsp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{dsp.dispatchNumber}</td>
                    <td className="p-3 font-mono text-slate-500 whitespace-nowrap">{dsp.dispatchDate}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{dsp.customerFirm}</div>
                      <span className="text-[11px] text-slate-400 font-mono">Invoice #{dsp.invoiceNumber}</span>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{dsp.destinationCity}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">{dsp.productSummary}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {dsp.totalBags} Bags ({dsp.totalWeightMT} MT)
                    </td>
                    <td className="p-3">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">{dsp.vehicleNumber}</div>
                      <div className="text-[11px] text-slate-400">{dsp.driverName}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dsp.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : dsp.status === 'In Transit'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {dsp.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPrintableChallan(dsp)}
                          title="Print Delivery Challan"
                          className="p-1.5 rounded hover:bg-slate-100 border text-slate-700"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                        {dsp.status === 'In Transit' && (
                          <button
                            onClick={() => updateDispatchStatus(dsp.id, 'Delivered')}
                            className="px-2.5 py-1 text-[11px] font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Weighbridge Management */}
      {activeTab === 'weighbridge' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b">
                <tr>
                  <th className="p-3">Slip No.</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Truck Number</th>
                  <th className="p-3">Party Name</th>
                  <th className="p-3">Commodity Goods</th>
                  <th className="p-3 text-right">Gross Wt (KG)</th>
                  <th className="p-3 text-right">Tare Wt (KG)</th>
                  <th className="p-3 text-right">Net Weight</th>
                  <th className="p-3">Operator</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {weighbridgeEntries.map(wb => (
                  <tr key={wb.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{wb.slipNumber}</td>
                    <td className="p-3 text-slate-500 font-mono whitespace-nowrap">{wb.dateTime}</td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{wb.vehicleNumber}</td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{wb.partyName}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{wb.commodity}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-700">{wb.grossWeight.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-mono text-slate-500">{wb.tareWeight.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-600 text-sm">
                      {wb.netWeight.toLocaleString('en-IN')} KG ({(wb.netWeight / 1000).toFixed(2)} MT)
                    </td>
                    <td className="p-3 text-slate-500">{wb.operatorName}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setPrintableSlip(wb)}
                        className="px-2.5 py-1 text-[11px] font-semibold border rounded hover:bg-slate-100 inline-flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print Parchi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Fleet Vehicles */}
      {activeTab === 'vehicles' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsAddVehicleOpen(true)}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Fleet Vehicle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map(veh => (
              <div key={veh.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-mono font-black text-sm text-slate-900 dark:text-white">{veh.vehicleNumber}</h3>
                    <span className="text-xs text-slate-500">{veh.type} · {veh.ownership}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    veh.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {veh.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Payload Capacity</span>
                    <strong className="font-mono text-slate-900 dark:text-white">{veh.capacityMT} MT ({veh.capacityBags} Bags)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Driver Incharge</span>
                    <strong className="text-slate-900 dark:text-white">{veh.driverName || 'Unassigned'}</strong>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between"><span>Fitness Certificate:</span><strong className="font-mono text-slate-700">{veh.fitnessExpiry}</strong></div>
                  <div className="flex justify-between"><span>Insurance Expiry:</span><strong className="font-mono text-slate-700">{veh.insuranceExpiry}</strong></div>
                  <div className="flex justify-between"><span>National Permit:</span><strong className="font-mono text-slate-700">{veh.permitExpiry}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Drivers */}
      {activeTab === 'drivers' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsAddDriverOpen(true)}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Licensed Driver
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map(drv => (
              <div key={drv.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{drv.name}</h3>
                    <span className="text-[11px] text-slate-500 font-mono">{drv.driverId}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {drv.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div>Phone: <strong className="font-mono">{drv.phone}</strong></div>
                  <div>Commercial DL: <strong className="font-mono">{drv.licenceNumber}</strong></div>
                  <div>DL Expiry: <strong className="font-mono text-slate-600">{drv.licenceExpiry}</strong></div>
                  <div>Assigned Truck: <strong className="font-mono text-emerald-600">{drv.assignedVehicleNumber || 'Spare Pool'}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal 1: Dispatch Order */}
      {isNewDispatchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-600" />
                Create Sales Dispatch & Delivery Challan
              </h3>
              <button onClick={() => setIsNewDispatchOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDispatch} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Linked Sales Tax Invoice *
                </label>
                <select
                  value={dispatchForm.salesInvoiceId}
                  onChange={e => setDispatchForm({ ...dispatchForm, salesInvoiceId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                >
                  {invoices.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.invoiceNumber} · {i.customerFirm} (₹{i.grandTotal.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Destination City *
                  </label>
                  <input
                    type="text"
                    required
                    value={dispatchForm.destinationCity}
                    onChange={e => setDispatchForm({ ...dispatchForm, destinationCity: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Total Feed Bags to Load *
                  </label>
                  <input
                    type="number"
                    required
                    value={dispatchForm.totalBags}
                    onChange={e => {
                      const bags = Number(e.target.value);
                      setDispatchForm({
                        ...dispatchForm,
                        totalBags: bags,
                        totalWeightMT: Number((bags * 0.05).toFixed(2)),
                      });
                    }}
                    className="w-full px-3 py-2 text-xs font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Assign Fleet Truck *
                  </label>
                  <select
                    value={dispatchForm.vehicleNumber}
                    onChange={e => setDispatchForm({ ...dispatchForm, vehicleNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.vehicleNumber}>{v.vehicleNumber} ({v.type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Driver Name & Phone
                  </label>
                  <input
                    type="text"
                    value={dispatchForm.driverName}
                    onChange={e => setDispatchForm({ ...dispatchForm, driverName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Delivery Destination Address
                </label>
                <textarea
                  rows={2}
                  value={dispatchForm.deliveryAddress}
                  onChange={e => setDispatchForm({ ...dispatchForm, deliveryAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewDispatchOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Dispatch Truck & Issue Challan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal 2: Log Weighbridge Entry */}
      {isNewWeighbridgeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" />
                Electronic Weighbridge Weighment Entry
              </h3>
              <button onClick={() => setIsNewWeighbridgeOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWeighbridge} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Truck Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={weighbridgeForm.vehicleNumber}
                    onChange={e => setWeighbridgeForm({ ...weighbridgeForm, vehicleNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Party Type
                  </label>
                  <select
                    value={weighbridgeForm.partyType}
                    onChange={e => setWeighbridgeForm({ ...weighbridgeForm, partyType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  >
                    <option value="Supplier">Supplier (Raw Grain Inward)</option>
                    <option value="Customer">Customer (Feed Dispatch)</option>
                    <option value="Internal Transfer">Internal Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Party Firm / Supplier Name *
                </label>
                <input
                  type="text"
                  required
                  value={weighbridgeForm.partyName}
                  onChange={e => setWeighbridgeForm({ ...weighbridgeForm, partyName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Commodity Material Description *
                </label>
                <input
                  type="text"
                  required
                  value={weighbridgeForm.commodity}
                  onChange={e => setWeighbridgeForm({ ...weighbridgeForm, commodity: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Gross Weight (KG) *
                  </label>
                  <input
                    type="number"
                    required
                    value={weighbridgeForm.grossWeight}
                    onChange={e => setWeighbridgeForm({ ...weighbridgeForm, grossWeight: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700 text-blue-600"
                  />
                  <span className="text-[10px] text-slate-400">Truck + Goods Weight</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tare Weight (KG) *
                  </label>
                  <input
                    type="number"
                    required
                    value={weighbridgeForm.tareWeight}
                    onChange={e => setWeighbridgeForm({ ...weighbridgeForm, tareWeight: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                  <span className="text-[10px] text-slate-400">Empty Truck Weight</span>
                </div>
              </div>

              {/* Net Weight Display */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Calculated Net Weight (Net = Gross - Tare)</span>
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    {liveWeighbridgeCalc.valid ? `${liveWeighbridgeCalc.netKg.toLocaleString('en-IN')} KG` : 'Error'}
                  </div>
                  {liveWeighbridgeCalc.valid && (
                    <span className="text-xs text-slate-400">
                      = {(liveWeighbridgeCalc.netKg / 1000).toFixed(3)} Metric Tonnes
                    </span>
                  )}
                </div>
                {!liveWeighbridgeCalc.valid && (
                  <span className="text-xs font-bold text-red-400">{liveWeighbridgeCalc.error}</span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewWeighbridgeOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!liveWeighbridgeCalc.valid}
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg shadow-sm"
                >
                  Generate Weighment Slip (Parchi)
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal 3: Printable Weighbridge Slip (Dharamyanta Parchi) */}
      {printableSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Electronic Weighbridge Certificate</span>
              <button onClick={() => setPrintableSlip(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Weighment Slip Box */}
            <div className="p-5 border-2 border-slate-900 rounded-xl space-y-3 bg-white text-slate-900 text-xs font-mono">
              <div className="text-center border-b pb-2">
                <div className="font-black text-sm uppercase text-emerald-800 font-sans">GOYAL CATTLE FEED PVT. LTD.</div>
                <div className="text-[10px] text-slate-600 font-sans">AUTOMATIC COMPUTERIZED WEIGHBRIDGE (50 MT CAPACITY)</div>
                <div className="text-[9px] text-slate-500 font-sans">GT Road, Khanna, Punjab · Tel: +91 1628 238900</div>
                <div className="mt-2 text-xs font-bold bg-slate-900 text-white py-0.5 tracking-wider uppercase font-sans">
                  WEIGHMENT SLIP / DHARAMYANTA PARCHI
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>Slip No: <strong className="font-bold">{printableSlip.slipNumber}</strong></div>
                <div className="text-right">Date: {printableSlip.dateTime}</div>
                <div>Vehicle: <strong className="text-sm font-bold">{printableSlip.vehicleNumber}</strong></div>
                <div className="text-right">Ref: {printableSlip.referenceNumber}</div>
                <div className="col-span-2">Party: <strong className="font-sans">{printableSlip.partyName}</strong></div>
                <div className="col-span-2">Item: <strong className="font-sans">{printableSlip.commodity}</strong></div>
              </div>

              <div className="border-2 border-slate-900 p-2.5 rounded space-y-1 text-xs">
                <div className="flex justify-between"><span>GROSS WEIGHT:</span><strong className="text-sm">{printableSlip.grossWeight.toLocaleString('en-IN')} KG</strong></div>
                <div className="flex justify-between"><span>TARE WEIGHT:</span><strong className="text-sm">{printableSlip.tareWeight.toLocaleString('en-IN')} KG</strong></div>
                <div className="flex justify-between border-t-2 border-slate-900 pt-1 text-base font-black text-emerald-800">
                  <span>NET WEIGHT:</span>
                  <span>{printableSlip.netWeight.toLocaleString('en-IN')} KG</span>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-sans font-bold">
                  ({(printableSlip.netWeight / 1000).toFixed(3)} Metric Tonnes)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 text-center text-[10px] font-sans">
                <div className="border-t border-dashed pt-1">Driver Signature</div>
                <div className="border-t border-dashed pt-1">Weighbridge Operator ({printableSlip.operatorName})</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => printDocument()}
                className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Weighment Slip
              </button>
              <button
                onClick={() => setPrintableSlip(null)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal 4: Printable Dispatch Challan */}
      {printableChallan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Goods Dispatch Delivery Challan</span>
              <button onClick={() => setPrintableChallan(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 border-2 border-slate-900 rounded-xl space-y-3 bg-white text-slate-900 text-xs">
              <div className="text-center border-b pb-2">
                <h3 className="font-black text-sm uppercase text-emerald-800">GOYAL CATTLE FEED PVT. LTD.</h3>
                <p className="text-[10px] text-slate-500">Khanna Main Plant, GT Road, Punjab · CIN: U01409PB2018PTC048123</p>
                <div className="mt-1 font-bold text-xs uppercase bg-slate-900 text-white py-0.5 tracking-wider">
                  DISPATCH DELIVERY CHALLAN
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>Challan No: <strong className="font-mono">{printableChallan.dispatchNumber}</strong></div>
                <div className="text-right">Date: {printableChallan.dispatchDate}</div>
                <div>Customer: <strong>{printableChallan.customerFirm}</strong></div>
                <div className="text-right">Invoice: #{printableChallan.invoiceNumber}</div>
                <div className="col-span-2">Destination: {printableChallan.destinationCity} ({printableChallan.deliveryAddress})</div>
                <div>Vehicle: <strong className="font-mono">{printableChallan.vehicleNumber}</strong></div>
                <div className="text-right">Driver: {printableChallan.driverName}</div>
              </div>

              <table className="w-full border text-left text-xs">
                <thead className="bg-slate-100 font-bold border-b">
                  <tr>
                    <th className="p-2">Item Dispatched</th>
                    <th className="p-2 text-right">Bags</th>
                    <th className="p-2 text-right">Weight (MT)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 font-semibold">{printableChallan.productSummary}</td>
                    <td className="p-2 text-right font-mono font-bold">{printableChallan.totalBags}</td>
                    <td className="p-2 text-right font-mono">{printableChallan.totalWeightMT}</td>
                  </tr>
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-4 pt-6 text-center text-[10px]">
                <div className="border-t border-dashed pt-1">Factory Gate Officer</div>
                <div className="border-t border-dashed pt-1">Dealer Receiver Stamp & Signature</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => printDocument()}
                className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Delivery Challan
              </button>
              <button
                onClick={() => setPrintableChallan(null)}
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
