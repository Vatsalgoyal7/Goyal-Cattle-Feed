import React from 'react';
import { SiteLanguage } from '../../i18n/siteCopy';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  currentLang: SiteLanguage;
  onChange: (lang: SiteLanguage) => void;
  className?: string;
  variant?: 'light' | 'dark';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLang,
  onChange,
  className = '',
  variant = 'light',
}) => {
  const options: { id: SiteLanguage; label: string; flag: string }[] = [
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { id: 'hinglish', label: 'Hinglish', flag: '🤝' },
  ];

  const baseContainer =
    variant === 'dark'
      ? 'bg-white/10 border-white/20 text-white'
      : 'bg-slate-100 border-slate-200 text-slate-700';

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl border backdrop-blur-sm shadow-xs ${baseContainer} ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <div className="flex items-center gap-1 px-2 text-xs font-semibold opacity-70">
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">भाषा / Lang:</span>
      </div>

      <div className="flex items-center gap-1">
        {options.map((opt) => {
          const isActive = currentLang === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-600'
                  : 'hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>{opt.flag}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
