import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppTheme, AccentColor, FontSize, DisplayMode } from '../../types';
import {
  Settings,
  X,
  Sun,
  Moon,
  Coffee,
  Type,
  Palette,
  Monitor,
  Smartphone,
  Check,
  ChevronRight,
  Sliders,
  RefreshCw,
  Eye,
} from 'lucide-react';

// Floating panel to customize everything in real-time
export const CustomizationPanel: React.FC = () => {
  const {
    theme, setTheme,
    accentColor, setAccentColor,
    fontSize, setFontSize,
    displayMode, setDisplayMode,
    language, setLanguage,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const themes: { id: AppTheme; label: string; labelHi: string; icon: React.ComponentType<{ className?: string }>; bg: string; border: string }[] = [
    { id: 'light', label: 'Light', labelHi: 'उजला', icon: Sun, bg: 'bg-white', border: 'border-slate-200' },
    { id: 'dark', label: 'Dark', labelHi: 'अँधेरा', icon: Moon, bg: 'bg-slate-900', border: 'border-slate-700' },
    { id: 'comfort', label: 'Comfort', labelHi: 'आरामदायक', icon: Coffee, bg: 'bg-amber-50', border: 'border-amber-200' },
  ];

  const accents: { id: AccentColor; color: string; label: string; labelHi: string; ring: string }[] = [
    { id: 'emerald', color: 'bg-emerald-600', label: 'Green', labelHi: 'हरा', ring: 'ring-emerald-600' },
    { id: 'blue', color: 'bg-blue-600', label: 'Blue', labelHi: 'नीला', ring: 'ring-blue-600' },
    { id: 'amber', color: 'bg-amber-500', label: 'Orange', labelHi: 'नारंगी', ring: 'ring-amber-500' },
    { id: 'slate', color: 'bg-slate-600', label: 'Grey', labelHi: 'स्लेटी', ring: 'ring-slate-600' },
  ];

  const fontSizes: { id: FontSize; label: string; labelHi: string; size: string }[] = [
    { id: 'small', label: 'Small', labelHi: 'छोटा', size: 'text-xs' },
    { id: 'normal', label: 'Normal', labelHi: 'सामान्य', size: 'text-sm' },
    { id: 'large', label: 'Large', labelHi: 'बड़ा', size: 'text-base' },
  ];

  const displayModes: { id: DisplayMode; label: string; labelHi: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'simple', label: 'Simple', labelHi: 'सरल', desc: 'Bade icons, kam options', icon: Smartphone },
    { id: 'advanced', label: 'Advanced', labelHi: 'विस्तृत', desc: 'Poori jankari', icon: Monitor },
  ];

  const handleReset = () => {
    setTheme('light');
    setAccentColor('emerald');
    setFontSize('normal');
    setDisplayMode('advanced');
    setLanguage('en');
  };

  return (
    <>
      {/* Toggle Button — fixed position */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 -translate-y-1/2 right-0 z-40 flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-5 rounded-l-xl shadow-xl transition-all group"
        title="Customize App — Real-time"
        aria-label="Open Customization Panel"
      >
        <Sliders className="w-4 h-4" />
        <span className="text-[10px] font-bold [writing-mode:vertical-rl] rotate-180 tracking-widest opacity-80 group-hover:opacity-100">
          CUSTOMIZE
        </span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Customization Panel"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">Customization</div>
              <div className="text-[11px] text-slate-500">सभी बदलाव तुरंत लागू होते हैं</div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">

          {/* THEME */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Theme / थीम
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    theme === t.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  {/* Mini preview */}
                  <div className={`w-10 h-7 rounded-lg ${t.bg} border ${t.border} flex items-center justify-center`}>
                    <t.icon className="w-3 h-3 text-slate-500" />
                  </div>
                  <div className="text-center">
                    <div className={`text-[11px] font-semibold ${theme === t.id ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>
                      {t.label}
                    </div>
                    <div className="text-[10px] text-slate-400">{t.labelHi}</div>
                  </div>
                  {theme === t.id && (
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* ACCENT COLOR */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Accent Color / रंग
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {accents.map(a => (
                <button
                  key={a.id}
                  onClick={() => setAccentColor(a.id)}
                  title={a.label}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${
                    accentColor === a.id
                      ? 'border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-800'
                      : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${a.color} ${accentColor === a.id ? `ring-2 ring-offset-2 ${a.ring}` : ''} transition-all flex items-center justify-center`}>
                    {accentColor === a.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">{a.labelHi}</div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              ⚠️ Accent color change is coming in next update
            </p>
          </section>

          {/* FONT SIZE */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-purple-500" />
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Font Size / अक्षर का आकार
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {fontSizes.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFontSize(f.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all ${
                    fontSize === f.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <Type className={`text-slate-500 ${f.id === 'small' ? 'w-3 h-3' : f.id === 'normal' ? 'w-4 h-4' : 'w-5 h-5'}`} />
                  <div className="text-center">
                    <div className={`text-[11px] font-semibold ${fontSize === f.id ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>
                      {f.label}
                    </div>
                    <div className="text-[10px] text-slate-400">{f.labelHi}</div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 text-center">
              👨‍👩‍👧‍👦 Bujurgon ke liye "Large" chunein
            </p>
          </section>

          {/* DISPLAY MODE */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-amber-500" />
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Display Mode / दृश्य मोड
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {displayModes.map(m => (
                <button
                  key={m.id}
                  onClick={() => setDisplayMode(m.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all ${
                    displayMode === m.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <m.icon className={`w-5 h-5 ${displayMode === m.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <div>
                    <div className={`text-[11px] font-bold ${displayMode === m.id ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>
                      {m.label}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight">{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* LANGUAGE */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-teal-500" />
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Language / भाषा
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['en', 'hi', 'hinglish'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`py-2.5 px-2 rounded-xl border-2 text-center transition-all ${
                    language === l
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="text-base mb-0.5">{l === 'en' ? '🇬🇧' : l === 'hi' ? '🇮🇳' : '🤝'}</div>
                  <div className={`text-[10px] font-semibold ${language === l ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500'}`}>
                    {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'Hinglish'}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* QUICK PREVIEW */}
          <section className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Live Preview</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Sab badlav abhi screen par dikh rahe hain — koi save button nahi chahiye.
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Default Settings Pe Reset Karein
          </button>
        </div>
      </div>
    </>
  );
};
