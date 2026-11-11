import React, { useState } from 'react';
import {
  Palette, Image, FileText, Download, Share2, Sparkles, Layout,
  Type, Wand2, Plus, Info, Star, ExternalLink, ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TEMPLATES = [
  { id: 'festival', title: 'Festival Greeting', type: 'Greeting', gradient: 'from-amber-500 to-orange-600', emoji: '🪔', desc: 'Diwali / Holi / Eid greetings for dealers' },
  { id: 'product', title: 'Product Poster', type: 'Marketing', gradient: 'from-emerald-600 to-teal-700', emoji: '🌾', desc: 'Cattle feed product highlight poster' },
  { id: 'dealer', title: 'Dealer Offer Card', type: 'Promotion', gradient: 'from-blue-600 to-indigo-700', emoji: '🤝', desc: 'Seasonal discount offer for dealers' },
  { id: 'social', title: 'Social Media Creative', type: 'Digital', gradient: 'from-purple-600 to-pink-600', emoji: '📱', desc: 'Instagram / Facebook square creative' },
  { id: 'announcement', title: 'Business Announcement', type: 'Corporate', gradient: 'from-rose-600 to-red-700', emoji: '📣', desc: 'New product launch or company news' },
  { id: 'visiting', title: 'Visiting Card Design', type: 'Identity', gradient: 'from-slate-700 to-slate-900', emoji: '💼', desc: 'Professional business card layout' },
];

const COLOR_THEMES = [
  { name: 'Emerald', bg: '#065f46', fg: '#fff' },
  { name: 'Royal Blue', bg: '#1e3a8a', fg: '#fff' },
  { name: 'Saffron', bg: '#b45309', fg: '#fff' },
  { name: 'Crimson', bg: '#991b1b', fg: '#fff' },
];

export const AICreativeStudioPage: React.FC = () => {
  const { userProfile } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState<typeof TEMPLATES[number] | null>(null);
  const [businessName, setBusinessName] = useState('Goyal Cattle Feed Pvt. Ltd.');
  const [tagline, setTagline] = useState('Premium Animal Nutrition Solutions');
  const [product, setProduct] = useState('Goyal Premium Pellet Feed 50kg');
  const [colorTheme, setColorTheme] = useState(COLOR_THEMES[0]);
  const [fontSize, setFontSize] = useState(16);
  const [toast, setToast] = useState('');

  // Business card fields
  const [bcName, setBcName] = useState('Rajesh Goyal');
  const [bcTitle, setBcTitle] = useState('Managing Director');
  const [bcCompany, setBcCompany] = useState('Goyal Cattle Feed Pvt. Ltd.');
  const [bcPhone, setBcPhone] = useState('+91 98140 55XXX');
  const [bcEmail, setBcEmail] = useState('rajesh@goyalcattlefeed.com');
  const [bcAddress, setBcAddress] = useState('Industrial Estate, GT Road, Khanna - 141401, Punjab');
  const [bcGstin, setBcGstin] = useState('03AABCG1234F1Z5');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`🌟 ${businessName}\n${tagline}\n📦 Product: ${product}\n\nContact us for best rates!`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-600" />
          Creative Studio
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Design marketing creatives, posters, and business cards for Goyal Cattle Feed.</p>
      </div>

      {toast && <div className="fixed top-20 right-4 z-50 bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs shadow-lg">{toast}</div>}

      {/* Demo banner */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs">
        <Info className="w-4 h-4 text-purple-600 shrink-0" />
        <span className="text-purple-800 dark:text-purple-200">Demo Mode \u2013 Image export and cloud save require backend configuration. WhatsApp text sharing is live.</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left: Template Gallery */}
        <div className="xl:col-span-3 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Template Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TEMPLATES.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`rounded-2xl overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 ${selectedTemplate?.id === t.id ? 'border-purple-500 shadow-lg shadow-purple-200 dark:shadow-purple-900/40' : 'border-transparent'}`}
              >
                {/* Template Preview */}
                <div className={`h-32 bg-gradient-to-br ${t.gradient} flex flex-col items-center justify-center p-3 relative`}>
                  <span className="text-3xl mb-1">{t.emoji}</span>
                  <p className="text-white text-[11px] font-bold text-center">{t.title}</p>
                  <span className="absolute top-2 right-2 text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-medium">{t.type}</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-800">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.desc}</p>
                  <button className={`mt-1.5 w-full py-1 rounded-lg text-[11px] font-semibold text-white bg-gradient-to-r ${t.gradient} hover:opacity-90 transition-opacity`}>
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Business Card Designer */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Business Card Designer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input fields */}
              <div className="space-y-2.5">
                {[
                  { label: 'Name', val: bcName, set: setBcName },
                  { label: 'Title / Designation', val: bcTitle, set: setBcTitle },
                  { label: 'Company', val: bcCompany, set: setBcCompany },
                  { label: 'Phone', val: bcPhone, set: setBcPhone },
                  { label: 'Email', val: bcEmail, set: setBcEmail },
                  { label: 'GSTIN', val: bcGstin, set: setBcGstin },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">{f.label}</label>
                    <input value={f.val} onChange={e => f.set(e.target.value)} className="mt-1 w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>
                ))}
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Address</label>
                  <textarea value={bcAddress} onChange={e => setBcAddress(e.target.value)} rows={2} className="mt-1 w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none" />
                </div>
              </div>

              {/* Business card preview */}
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase mb-2">Preview</p>
                <div className="rounded-xl overflow-hidden shadow-lg aspect-[1.75/1] flex flex-col p-4 relative" style={{ background: `linear-gradient(135deg, #065f46 0%, #047857 100%)` }}>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm leading-tight">{bcName}</p>
                    <p className="text-emerald-200 text-[11px] font-medium">{bcTitle}</p>
                    <p className="text-white/80 text-[10px] mt-1">{bcCompany}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-emerald-100 text-[10px]">📱 {bcPhone}</p>
                    <p className="text-emerald-100 text-[10px]">✉ {bcEmail}</p>
                    <p className="text-emerald-100 text-[10px] leading-tight">{bcAddress}</p>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full bg-white/5" />
                </div>
                <button onClick={() => showToast('Demo Mode \u2013 Image download requires html2canvas backend configuration.')} className="mt-2 w-full py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                  <Download className="w-3 h-3" />Download Card (Demo Mode)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Design Editor */}
        <div className="xl:col-span-2">
          <div className="sticky top-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-purple-600" />
                {selectedTemplate ? selectedTemplate.title : 'Design Editor'}
              </h2>
            </div>

            {!selectedTemplate ? (
              <div className="p-8 text-center text-sm text-slate-400 space-y-2">
                <Sparkles className="w-10 h-10 mx-auto text-purple-300" />
                <p>Select a template from the gallery to start designing</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Live Preview */}
                <div className={`rounded-xl overflow-hidden h-48 bg-gradient-to-br ${selectedTemplate.gradient} flex flex-col items-center justify-center p-6 relative`}>
                  <span className="text-4xl mb-2">{selectedTemplate.emoji}</span>
                  <p className="text-white text-center font-bold leading-tight" style={{ fontSize: fontSize }}>
                    {businessName}
                  </p>
                  <p className="text-white/80 text-center text-xs mt-1">{tagline}</p>
                  <p className="text-white/60 text-center text-[11px] mt-0.5">{product}</p>
                  <div className="absolute bottom-2 right-3 w-6 h-6 rounded-full" style={{ background: colorTheme.bg }} />
                </div>

                {/* Controls */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Business Name</label>
                    <input value={businessName} onChange={e => setBusinessName(e.target.value)} className="mt-1 w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Tagline / Offer</label>
                    <input value={tagline} onChange={e => setTagline(e.target.value)} className="mt-1 w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Product Name</label>
                    <input value={product} onChange={e => setProduct(e.target.value)} className="mt-1 w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Font Size: {fontSize}px</label>
                    <input type="range" min={12} max={24} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="mt-1 w-full accent-purple-600" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Color Theme</label>
                    <div className="flex gap-2 mt-1">
                      {COLOR_THEMES.map(t => (
                        <button key={t.name} onClick={() => setColorTheme(t)} title={t.name} className={`w-7 h-7 rounded-full border-2 transition-all ${colorTheme.name === t.name ? 'scale-125 border-purple-500' : 'border-transparent'}`} style={{ background: t.bg }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2 pt-2">
                  <button onClick={shareWhatsApp} className="w-full py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" />Share via WhatsApp
                  </button>
                  <button onClick={() => showToast('Demo Mode \u2013 Image export requires html2canvas backend configuration.')} className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />Download as PNG (Demo)
                  </button>
                  <button onClick={() => showToast('Demo Mode \u2013 Cloud storage not configured. Files saved locally only.')} className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />Save to Cloud Files
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
