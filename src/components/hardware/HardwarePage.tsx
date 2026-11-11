import React, { useState, useEffect } from 'react';
import {
  Cpu, Bluetooth, Wifi, CheckCircle2, XCircle, AlertTriangle,
  Settings, RefreshCw, Zap, Printer, Scale, QrCode, Info,
  Plus, ChevronDown, ChevronRight, Usb, Circle,
} from 'lucide-react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { HardwareDevice } from '../../types';

const TYPE_ICONS: Record<string, React.ComponentType<any>> = {
  'Barcode Scanner': QrCode,
  'Thermal Printer': Printer,
  'Weighing Scale': Scale,
  'Weighbridge RS232': Scale,
  'Label Printer': Printer,
};

const CONNECTION_ICONS: Record<string, React.ComponentType<any>> = {
  'USB / HID': Usb,
  'Bluetooth': Bluetooth,
  'Network IP / TCP': Wifi,
  'RS-232 Serial COM': Cpu,
};

const StatusDot: React.FC<{ status: HardwareDevice['status'] }> = ({ status }) => {
  const cfg: Record<string, { color: string; label: string }> = {
    Connected: { color: 'bg-emerald-500', label: 'text-emerald-700 dark:text-emerald-400' },
    'Demo Mode': { color: 'bg-amber-500', label: 'text-amber-700 dark:text-amber-400' },
    'Not Configured': { color: 'bg-slate-400', label: 'text-slate-500' },
    'Connection Failed': { color: 'bg-red-500', label: 'text-red-700 dark:text-red-400' },
    Unsupported: { color: 'bg-slate-300', label: 'text-slate-400' },
  };
  const { color, label } = cfg[status] || cfg['Not Configured'];
  return (
    <span className={`flex items-center gap-1.5 text-xs font-semibold ${label}`}>
      <span className={`w-2 h-2 rounded-full ${color} ${status === 'Connected' ? 'shadow shadow-emerald-400' : ''}`} />
      {status}
    </span>
  );
};

// Browser API availability checker
const BrowserAPIs: React.FC = () => {
  const [apis, setApis] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setApis({
      'WebHID API': 'hid' in navigator,
      'Web Bluetooth': 'bluetooth' in navigator,
      'Web Serial API': 'serial' in navigator,
      'Web USB': 'usb' in navigator,
    });
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3">
      <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">Browser Hardware API Support</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.entries(apis).map(([name, supported]) => (
          <div key={name} className={`p-2.5 rounded-xl border text-xs ${supported ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'}`}>
            <div className="flex items-center gap-1.5 mb-1">
              {supported ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-slate-400" />}
              <span className={`font-semibold ${supported ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-500'}`}>{supported ? 'Supported' : 'Not Supported'}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">{name}</p>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <Info className="w-3 h-3 shrink-0 mt-0.5" />
        <span>Some hardware may require a local driver bridge application or Chrome browser. HTTPS connection required for most WebAPIs.</span>
      </div>
    </div>
  );
};

// Device Card
const DeviceCard: React.FC<{ device: HardwareDevice }> = ({ device }) => {
  const { updateHardwareDeviceStatus } = useEnterprise();
  const [expanded, setExpanded] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState('');

  const TypeIcon = TYPE_ICONS[device.type] ?? Cpu;
  const ConnIcon = CONNECTION_ICONS[device.connectionType] ?? Cpu;

  const testConnection = async () => {
    setTesting(true);
    setTestResult('');
    await new Promise(r => setTimeout(r, 1200));

    if (device.connectionType === 'USB / HID' && device.type === 'Barcode Scanner') {
      if ('hid' in navigator) {
        setTestResult('WebHID API available. Requesting device access requires user gesture – click "Connect" in browser prompt.');
        updateHardwareDeviceStatus(device.id, 'Demo Mode');
      } else {
        setTestResult('WebHID API not supported in this browser. Use Chrome 89+ for barcode scanner support.');
        updateHardwareDeviceStatus(device.id, 'Unsupported');
      }
    } else if (device.connectionType === 'Bluetooth') {
      if ('bluetooth' in navigator) {
        setTestResult('Web Bluetooth available. Pairing requires user gesture – the browser will show a device picker.');
        updateHardwareDeviceStatus(device.id, 'Demo Mode');
      } else {
        setTestResult('Web Bluetooth not supported. Use Chrome on desktop/Android.');
        updateHardwareDeviceStatus(device.id, 'Unsupported');
      }
    } else if (device.connectionType === 'RS-232 Serial COM') {
      if ('serial' in navigator) {
        setTestResult('Web Serial API available. Connect the RS-232 device and click "Connect" to pair.');
        updateHardwareDeviceStatus(device.id, 'Demo Mode');
      } else {
        setTestResult('Web Serial API not available. Requires Chrome 89+ or a local driver bridge application.');
        updateHardwareDeviceStatus(device.id, 'Unsupported');
      }
    } else {
      setTestResult('Connection test requires physical device. This module runs in Demo Mode – no hardware is actually connected.');
      updateHardwareDeviceStatus(device.id, 'Demo Mode');
    }
    setTesting(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-xs">
      <div className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
          <TypeIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{device.name}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  <ConnIcon className="w-3 h-3" /> {device.connectionType}
                </span>
                <span className="text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">{device.type}</span>
              </div>
            </div>
            <StatusDot status={device.status} />
          </div>
          {device.lastActive && <p className="text-[11px] text-slate-400 mt-1">Last active: {device.lastActive}</p>}
        </div>
      </div>

      {/* Config details toggle */}
      <div className="border-t border-slate-100 dark:border-slate-700">
        <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
          <span>Configuration Details</span>
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        {expanded && (
          <div className="px-4 pb-3 grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(device.config).map(([k, v]) => (
              <div key={k} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2">
                <p className="text-[10px] text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</p>
                <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">{String(v)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-slate-100 dark:border-slate-700 flex gap-2 p-3">
        <button
          onClick={testConnection}
          disabled={testing}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-800 dark:bg-slate-600 hover:bg-slate-900 dark:hover:bg-slate-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
        >
          {testing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {testResult && (
        <div className="mx-3 mb-3 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-800 dark:text-indigo-200 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {testResult}
        </div>
      )}
    </div>
  );
};

// Add Device Form
const AddDeviceForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<HardwareDevice['type']>('Barcode Scanner');
  const [conn, setConn] = useState<HardwareDevice['connectionType']>('USB / HID');
  const [toast, setToast] = useState('');
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const handleAdd = () => {
    if (!name) { showToast('Please enter a device name.'); return; }
    showToast(`Device "${name}" added in Not Configured state.`);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      {toast && <div className="fixed top-20 right-4 z-50 bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs shadow-lg">{toast}</div>}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Add Hardware Device</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XCircle className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase">Device Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. TVS Thermal Printer (Counter 2)" className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase">Device Type</label>
            <select value={type} onChange={e => setType(e.target.value as HardwareDevice['type'])} className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {['Barcode Scanner', 'Thermal Printer', 'Weighing Scale', 'Weighbridge RS232', 'Label Printer'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase">Connection Type</label>
            <select value={conn} onChange={e => setConn(e.target.value as HardwareDevice['connectionType'])} className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {['USB / HID', 'Bluetooth', 'Network IP / TCP', 'RS-232 Serial COM'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAdd} className="flex-1 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition-colors">Add Device</button>
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export const HardwarePage: React.FC = () => {
  const { hardwareDevices } = useEnterprise();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-slate-600" />Hardware Devices
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage scanners, printers, weighing scales, and industrial hardware.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors">
          <Plus className="w-4 h-4" />Add Device
        </button>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
        <span className="text-amber-800 dark:text-amber-200">
          Hardware integrations run in Demo Mode. Real connections require supported browser APIs (Chrome 89+) or a local driver bridge. 
          <strong className="ml-1">Never shows fake connection success.</strong>
        </span>
      </div>

      <BrowserAPIs />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hardwareDevices.map(device => <DeviceCard key={device.id} device={device} />)}
      </div>

      {showAdd && <AddDeviceForm onClose={() => setShowAdd(false)} />}
    </div>
  );
};
