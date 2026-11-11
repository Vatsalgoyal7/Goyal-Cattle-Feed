import React, { useState, useRef } from 'react';
import {
  FolderOpen, Upload, Download, Trash2, Eye, Lock, Unlock, Search,
  FileText, Image, File, Info, HardDrive, AlertTriangle, CheckCircle2,
  Plus, X, Filter,
} from 'lucide-react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { CloudStorageFile } from '../../types';

const FILE_CATEGORIES: CloudStorageFile['category'][] = [
  'Invoices', 'Quality Reports', 'Transport', 'Employee KYC', 'Product Images', 'Certificates',
];

const FileIcon: React.FC<{ mimeType: string; className?: string }> = ({ mimeType, className = 'w-4 h-4' }) => {
  if (mimeType.startsWith('image/')) return <Image className={`${className} text-blue-500`} />;
  if (mimeType === 'application/pdf') return <FileText className={`${className} text-red-500`} />;
  return <File className={`${className} text-slate-400`} />;
};

const formatSize = (sizeStr: string): string => sizeStr;

export const CloudFilesPage: React.FC = () => {
  const { cloudFiles } = useEnterprise();
  const [category, setCategory] = useState<CloudStorageFile['category'] | 'All'>('All');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [newFileCategory, setNewFileCategory] = useState<CloudStorageFile['category']>('Certificates');
  const [isPrivate, setIsPrivate] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  const filtered = cloudFiles.filter(f =>
    (category === 'All' || f.category === category) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  // Compute "storage used" estimate
  const totalFiles = cloudFiles.length;
  const storageUsedMb = cloudFiles.reduce((s, f) => {
    const num = parseFloat(f.size);
    if (f.size.includes('MB')) return s + num;
    if (f.size.includes('KB')) return s + num / 1024;
    return s;
  }, 0);
  const storagePercent = Math.min((storageUsedMb / 1024) * 100, 100);

  const handleFileSelect = () => {
    showToast('File selected – saved to Demo Storage. Configure cloud storage (Supabase/S3) for real file hosting.');
    setShowUpload(false);
  };

  return (
    <div className="space-y-4">
      {toast && <div className="fixed top-20 right-4 z-50 bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs shadow-lg">{toast}</div>}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-600" />Cloud Files
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Store and manage business documents, certificates, and media.</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition-colors shadow-xs">
          <Upload className="w-4 h-4" />Upload File
        </button>
      </div>

      {/* Demo banner */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
        <span className="text-amber-800 dark:text-amber-200">Demo Mode – Local storage only. Cloud file hosting requires Supabase, AWS S3, or Google Cloud Storage configuration.</span>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Files', value: `${totalFiles} files`, icon: FolderOpen, color: 'indigo' },
          { label: 'Storage Used', value: `${storageUsedMb.toFixed(1)} MB / 1 GB`, icon: HardDrive, color: 'emerald' },
          { label: 'Private Files', value: `${cloudFiles.filter(f => f.isPrivate).length} files`, icon: Lock, color: 'amber' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-${s.color}-100 dark:bg-${s.color}-950/50 flex items-center justify-center`}>
                <Icon className={`w-4 h-4 text-${s.color}-700 dark:text-${s.color}-400`} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Storage bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>Storage</span><span>{storageUsedMb.toFixed(1)} MB / 1024 MB</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${storagePercent}%` }} />
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {(['All', ...FILE_CATEGORIES] as const).map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${category === cat ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{cat}</button>
          ))}
        </div>
      </div>

      {/* File Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 shadow-xs">
        {/* Desktop header */}
        <div className="hidden md:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_auto] px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
          <span>File Name</span><span>Category</span><span>Size</span><span>Uploaded</span><span>Uploaded By</span><span>Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            <FolderOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            No files found in this category.
          </div>
        ) : (
          filtered.map(f => (
            <div key={f.id} className="grid grid-cols-1 md:grid-cols-[2.5fr_1fr_1fr_1fr_1fr_auto] items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 gap-y-1 md:gap-0">
              <div className="flex items-center gap-2 min-w-0">
                <FileIcon mimeType={f.mimeType} />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">{f.name}</span>
                {f.isPrivate
                  ? <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                  : <Unlock className="w-3 h-3 text-slate-300 shrink-0" />
                }
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 w-fit">{f.category}</span>
              <span className="text-xs text-slate-500">{f.size}</span>
              <span className="text-xs text-slate-500">{f.uploadDate}</span>
              <span className="text-xs text-slate-500 truncate">{f.uploadedBy}</span>
              <div className="flex gap-1">
                <button onClick={() => showToast('Preview not available in Demo Mode.')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 transition-colors" title="Preview">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => showToast('Download not available in Demo Mode. Configure cloud storage to enable.')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-600 transition-colors" title="Download">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">Upload File</h2>
              <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={e => { e.preventDefault(); setIsDragOver(false); handleFileSelect(); }}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragOver ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-300'}`}
            >
              <input ref={fileRef} type="file" className="hidden" onChange={handleFileSelect} />
              <Upload className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Drop file or click to select</p>
              <p className="text-[11px] text-slate-400 mt-1">Max 50MB per file</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase">Category</label>
                <select value={newFileCategory} onChange={e => setNewFileCategory(e.target.value as CloudStorageFile['category'])} className="mt-1 w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  {FILE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Private File</span>
                <button onClick={() => setIsPrivate(!isPrivate)} className={`w-10 h-5 rounded-full transition-colors relative ${isPrivate ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isPrivate ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            <button onClick={handleFileSelect} className="w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition-colors">
              Upload to Demo Storage
            </button>
            <p className="text-[10px] text-center text-slate-400">Demo Mode – Files are not actually uploaded. Configure Supabase Storage for real hosting.</p>
          </div>
        </div>
      )}
    </div>
  );
};
