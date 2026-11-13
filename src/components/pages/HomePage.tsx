import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../common/BrandLogo';
import { LanguageToggle } from '../common/LanguageToggle';
import { SITE_CONTENT, SiteLanguage } from '../../i18n/siteCopy';
import {
  BarChart3,
  Package,
  Users,
  Sparkles,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Star,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Zap,
} from 'lucide-react';

const useCounter = (target: number, duration = 1500, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

const FEATURE_ICONS = [
  { icon: BarChart3, color: 'bg-blue-600' },
  { icon: Package, color: 'bg-emerald-600' },
  { icon: Users, color: 'bg-purple-600' },
  { icon: Sparkles, color: 'bg-amber-600' },
  { icon: Truck, color: 'bg-red-600' },
  { icon: ShieldCheck, color: 'bg-teal-600' },
];

export const HomePage: React.FC = () => {
  const [lang, setLang] = useState<SiteLanguage>(() => {
    return (localStorage.getItem('goyal_lang') as SiteLanguage) || 'hi';
  });

  const handleLangChange = (newLang: SiteLanguage) => {
    setLang(newLang);
    localStorage.setItem('goyal_lang', newLang);
  };

  const copy = SITE_CONTENT[lang];

  const [menuOpen, setMenuOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const c0 = useCounter(50, 1200, statsVisible);
  const c1 = useCounter(100, 1200, statsVisible);
  const c2 = useCounter(6, 1000, statsVisible);
  const c3 = useCounter(4, 1000, statsVisible);
  const counts = [c0, c1, c2, c3];

  return (
    <div
      className="min-h-screen bg-white text-slate-900 select-none"
      style={{ fontFamily: "'Inter', 'Noto Sans Devanagari', sans-serif" }}
    >
      {/* ── TOP ANNOUNCEMENT & LANGUAGE BAR ── */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-2 px-4 border-b border-emerald-900 flex items-center justify-between">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <span className="truncate">{copy.hero.badge}</span>
          <div className="flex items-center gap-3">
            <LanguageToggle currentLang={lang} onChange={handleLangChange} variant="dark" />
          </div>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between">
          <Link to="/">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-700">
            <a href="#features" className="hover:text-emerald-800 transition-colors">
              {copy.nav.features}
            </a>
            <Link to="/about" className="hover:text-emerald-800 transition-colors">
              {copy.nav.about}
            </Link>
            <a href="#contact" className="hover:text-emerald-800 transition-colors">
              {copy.nav.contact}
            </a>
          </div>

          <div className="hidden md:flex items-center">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-black text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-950/20 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{copy.nav.login}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 text-slate-700 hover:text-emerald-800"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-5 py-5 space-y-3 shadow-lg">
            <div className="pb-2 border-b border-slate-100">
              <LanguageToggle currentLang={lang} onChange={handleLangChange} />
            </div>
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-700"
            >
              {copy.nav.features}
            </a>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-700"
            >
              {copy.nav.about}
            </Link>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-700"
            >
              {copy.nav.contact}
            </a>
            <Link
              to="/app"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center py-3 bg-emerald-800 text-white font-extrabold rounded-xl"
            >
              {copy.nav.login}
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="pt-16 pb-20 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                <Zap className="w-3.5 h-3.5 text-emerald-700" />
                <span>{copy.hero.badge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] mb-6 tracking-tight">
                {copy.hero.titleLine1} <br />
                <span className="text-emerald-800">{copy.hero.titleHighlight}</span> <br />
                <span className="text-amber-500">{copy.hero.titleLine2}</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl font-medium">
                {copy.hero.desc}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  to="/app"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-800 hover:bg-emerald-700 text-white font-black rounded-2xl text-base transition-all shadow-xl shadow-emerald-950/20 hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>{copy.hero.ctaPrimary}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-7 py-4 border-2 border-slate-300 text-slate-800 font-extrabold rounded-2xl text-base hover:border-emerald-600 hover:text-emerald-800 transition-all cursor-pointer"
                >
                  <span>{copy.hero.ctaSecondary}</span>
                </Link>
              </div>

              {/* 4 Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200">
                {[copy.hero.trust1, copy.hero.trust2, copy.hero.trust3, copy.hero.trust4].map(
                  (trust, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{trust}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Real Store Photo & Location Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-800/20 shadow-2xl bg-white p-3 group">
                <div className="rounded-2xl overflow-hidden relative">
                  <img
                    src="/images/goyal_shop_real.png"
                    alt="Goyal Cattle Feed Store - Gajraula Real Store Front"
                    className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

                  {/* Top Rating Pill */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-slate-900 shadow-md flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>5.0</span>
                    <span className="text-slate-400 font-normal">(5 Google Reviews)</span>
                  </div>

                  {/* Bottom Store Details */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                      गोयल कैटल फीड स्टोर · गजरौला
                    </div>
                    <div className="text-sm font-bold leading-tight mt-0.5">
                      Kavi Nagar, near Indra Chowk, Gajraula, UP
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="bg-emerald-700/80 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        SP पशु आहार
                      </span>
                      <span className="bg-emerald-700/80 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        गवाक्ष
                      </span>
                      <span className="bg-emerald-700/80 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        सरसों खल
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl mt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Single Compound: Shop & Godowns</span>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/D8MwEcaxc7GNyc8r7"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-800 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Google Maps</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-300 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section ref={statsRef} className="py-14 bg-emerald-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: counts[0], suff: '+', label: copy.stats.s1Label },
              { num: counts[1], suff: '%', label: copy.stats.s2Label },
              { num: counts[2], suff: '+', label: copy.stats.s3Label },
              { num: counts[3], suff: '+', label: copy.stats.s4Label },
            ].map((st, i) => (
              <div key={i} className="space-y-1">
                <div className="text-4xl lg:text-5xl font-black text-amber-300 font-mono">
                  {st.num}
                  {st.suff}
                </div>
                <div className="text-emerald-100 text-xs sm:text-sm font-semibold">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-emerald-800 text-xs font-extrabold uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              {copy.features.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 mb-4 tracking-tight">
              {copy.features.heading}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              {copy.features.subheading}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {copy.features.items.map((item, i) => {
              const IconData = FEATURE_ICONS[i % FEATURE_ICONS.length];
              const IconComp = IconData.icon;
              return (
                <div
                  key={i}
                  className="group p-7 bg-slate-50/80 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 ${IconData.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md`}
                  >
                    <IconComp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900">{copy.testimonials.heading}</h2>
            <p className="text-sm text-slate-600 mt-2 font-medium">
              {copy.testimonials.subheading}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {copy.testimonials.items.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-7 shadow-xs border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((_, starIdx) => (
                      <Star key={starIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="font-black text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500 font-semibold">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section
        className="py-20 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <BrandLogo size="lg" variant="white" className="justify-center mb-6" />
          <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
            {copy.cta.heading}
          </h2>
          <p className="text-emerald-100 text-base sm:text-lg mb-8 leading-relaxed max-w-xl mx-auto">
            {copy.cta.desc}
          </p>

          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-9 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base rounded-2xl transition-all shadow-xl hover:-translate-y-0.5 cursor-pointer"
          >
            <span>{copy.cta.button}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="bg-slate-950 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 pb-10 border-b border-slate-800">
            <div>
              <BrandLogo size="md" variant="white" className="mb-4" />
              <p className="text-xs leading-relaxed text-slate-400 max-w-xs">
                {SITE_CONTENT[lang].hero.desc}
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-4">Navigation</h4>
              <div className="space-y-2 text-xs font-semibold">
                <a href="#features" className="block hover:text-emerald-400 transition-colors">
                  {copy.nav.features}
                </a>
                <Link to="/about" className="block hover:text-emerald-400 transition-colors">
                  {copy.nav.about}
                </Link>
                <Link to="/app" className="block hover:text-emerald-400 transition-colors">
                  {copy.nav.login}
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-4">Official Contact</h4>
              <div className="space-y-2.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>+91 98370 49021</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>goyalcattlefeed@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Kavi Nagar, near Indra Chowk, Gajraula, UP 244235</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>© {new Date().getFullYear()} Goyal Cattle Feed Pvt. Ltd. · All Rights Reserved.</div>
            <div>
              Powered by <span className="text-emerald-400 font-bold">Goyal Business OS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
