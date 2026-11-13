import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'white';
  className?: string;
  showHindi?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  showHindi = true,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-sm font-black tracking-tight',
    md: 'text-base font-black tracking-tight',
    lg: 'text-xl font-black tracking-tight',
    xl: 'text-3xl font-black tracking-tight',
  };

  const subtitleSizes = {
    sm: 'text-[9px] font-semibold tracking-wider',
    md: 'text-[10px] font-semibold tracking-wider',
    lg: 'text-xs font-semibold tracking-wider',
    xl: 'text-sm font-semibold tracking-wider',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* ── EMBLEM CREST: Kamdhenu Cow + Golden Wheat + Royal Emerald Shield ── */}
      <div
        className={`${iconSizes[size]} relative rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/25 transition-transform hover:scale-105`}
        style={{
          background: 'linear-gradient(145deg, #022c22 0%, #064e3b 45%, #047857 100%)',
          border: '1.5px solid rgba(251, 191, 36, 0.55)',
          boxShadow: '0 4px 14px -1px rgba(6, 78, 59, 0.4), inset 0 1px 2px rgba(254, 240, 138, 0.4)',
        }}
      >
        {/* Subtle golden inner ring */}
        <div className="absolute inset-0.5 rounded-xl border border-amber-400/25 pointer-events-none" />

        {/* Master SVG Crest */}
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[82%] h-[82%]"
        >
          <defs>
            {/* Gold foil gradient */}
            <linearGradient id="goldFoil" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF08A" />
              <stop offset="0.45" stopColor="#F59E0B" />
              <stop offset="0.75" stopColor="#D97706" />
              <stop offset="1" stopColor="#FBBF24" />
            </linearGradient>

            {/* Shield interior gradient */}
            <radialGradient id="shieldInterior" cx="32" cy="24" r="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#059669" stopOpacity="0.4" />
              <stop offset="0.7" stopColor="#064e3b" stopOpacity="0.85" />
              <stop offset="1" stopColor="#022c22" stopOpacity="0.95" />
            </radialGradient>

            {/* Cow glow filter */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Heraldic Shield Base */}
          <path
            d="M32 5L12 12V28C12 42 20 51.5 32 58C44 51.5 52 42 52 28V12L32 5Z"
            fill="url(#shieldInterior)"
            stroke="url(#goldFoil)"
            strokeWidth="1.8"
          />

          {/* Sun Rays / Radiance Arc */}
          <circle cx="32" cy="24" r="14" stroke="#FDE68A" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" />

          {/* Golden Wheat Left Stalk */}
          <path
            d="M17 38C17 33 19 28 22 23M19 24C16.5 22.5 15.5 20 17 18C18.5 20 20 21.5 19 24ZM18 29C15.5 28 14.5 25.5 16 23.5C17.5 25.5 19 27 18 29ZM20 34C17.5 33 16.5 30.5 18 28.5C19.5 30.5 21 32 20 34Z"
            stroke="url(#goldFoil)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Golden Wheat Right Stalk */}
          <path
            d="M47 38C47 33 45 28 42 23M45 24C47.5 22.5 48.5 20 47 18C45.5 20 44 21.5 45 24ZM46 29C48.5 28 49.5 25.5 48 23.5C46.5 25.5 45 27 46 29ZM44 34C46.5 33 47.5 30.5 46 28.5C44.5 30.5 43 32 44 34Z"
            stroke="url(#goldFoil)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Kamdhenu / Sacred Dairy Cow & Calf Silhouette */}
          <g filter="url(#softGlow)">
            {/* Adult Cow Silhouette */}
            <path
              d="M26 23C27 21 29 20 31 20C32.5 20 34 20.8 35 22C36.5 21.5 38 21.5 39.5 22.5C40.5 23.2 41 24.5 40.5 26C41.8 26.5 42.5 27.5 42 29C41.5 30 40 30.2 38.5 30C38 31 37 32 35 32H33L32.5 35H30.5L31 32H29L28.5 35H26.5L27 31.5C25.5 31 24.5 29.8 24.5 28C24.5 26 25 24.5 26 23Z"
              fill="url(#goldFoil)"
            />
            {/* Horns & Ears */}
            <path
              d="M39.5 22.5C40 21 41 19.5 42 19C41.5 20.5 41 21.5 40.5 22.5Z"
              fill="#FEF08A"
            />
            <path
              d="M38 21.5C37.5 20 37 18.5 36 18C37 19.5 37.5 20.5 38 21.5Z"
              fill="#FEF08A"
            />
            {/* Calf Silhouette beside Cow */}
            <path
              d="M22 28.5C22.8 27.5 24 27 25 27C26 27.5 26.5 28.5 26 29.5L25.5 32H24.5L24.8 30H23.5L23.2 32H22.2L22 28.5Z"
              fill="#FEF08A"
              opacity="0.95"
            />
          </g>

          {/* Crown Star at Top */}
          <path
            d="M32 9L33.2 12.2L36.5 12.5L34 14.7L34.8 18L32 16.2L29.2 18L30 14.7L27.5 12.5L30.8 12.2L32 9Z"
            fill="url(#goldFoil)"
          />

          {/* Base Est. Ribbon Line */}
          <circle cx="32" cy="46" r="1.5" fill="#FBBF24" />
          <line x1="26" y1="46" x2="30" y2="46" stroke="#FBBF24" strokeWidth="1" strokeLinecap="round" />
          <line x1="34" y1="46" x2="38" y2="46" stroke="#FBBF24" strokeWidth="1" strokeLinecap="round" />
        </svg>

        {/* Small Golden Corner Sparkle */}
        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-xs ring-1 ring-amber-300" />
      </div>

      {/* ── TYPOGRAPHY: Royal Goyal Cattle Feed Store ── */}
      {variant !== 'icon' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`${titleSizes[size]} font-black ${
                variant === 'white' ? 'text-white' : 'text-slate-900 dark:text-white'
              }`}
              style={{ letterSpacing: '-0.02em' }}
            >
              GOYAL
            </span>
            <span
              className={`${titleSizes[size]} text-amber-500 dark:text-amber-400 font-black`}
              style={{ letterSpacing: '-0.02em' }}
            >
              CATTLE FEED
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`${subtitleSizes[size]} font-bold ${
                variant === 'white' ? 'text-emerald-300' : 'text-emerald-800 dark:text-emerald-300'
              }`}
            >
              {showHindi ? 'गोयल पशु आहार · गजरौला' : 'Business Management OS'}
            </span>
            <span className="hidden sm:inline-block text-[9px] font-mono px-1 rounded bg-amber-400/20 text-amber-600 dark:text-amber-300 font-bold">
              ESTD 2002
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
