import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../common/BrandLogo';
import { LanguageToggle } from '../common/LanguageToggle';
import { SITE_CONTENT, SiteLanguage } from '../../i18n/siteCopy';
import {
  Target,
  Eye,
  Heart,
  Rocket,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

const VALUE_ICONS = [Target, Eye, Heart, Rocket];

const TEAM = [
  { name: 'Vatsal Goyal', role: 'Proprietor & Business Head', avatar: 'VG', color: 'bg-emerald-800' },
  { name: 'Goyal Family', role: 'Store Management & Operations', avatar: 'GF', color: 'bg-amber-700' },
  { name: 'Godown Logistics', role: 'Inventory & Dispatch (Gajraula)', avatar: 'GL', color: 'bg-blue-800' },
  { name: 'Counter Sales', role: 'Retail & Mandi Customer Support', avatar: 'CS', color: 'bg-teal-800' },
];

export const AboutPage: React.FC = () => {
  const [lang, setLang] = useState<SiteLanguage>(() => {
    return (localStorage.getItem('goyal_lang') as SiteLanguage) || 'hi';
  });

  const handleLangChange = (newLang: SiteLanguage) => {
    setLang(newLang);
    localStorage.setItem('goyal_lang', newLang);
  };

  const copy = SITE_CONTENT[lang].about;
  const navCopy = SITE_CONTENT[lang].nav;

  return (
    <div
      className="min-h-screen bg-white text-slate-900 select-none"
      style={{ fontFamily: "'Inter', 'Noto Sans Devanagari', sans-serif" }}
    >
      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between">
          <Link to="/">
            <BrandLogo size="md" />
          </Link>

          <div className="flex items-center gap-4">
            <LanguageToggle currentLang={lang} onChange={handleLangChange} />
            <Link
              to="/"
              className="text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-800 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/app"
              className="px-4 py-2 text-xs font-extrabold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-all shadow-md"
            >
              {navCopy.login}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO BANNER ── */}
      <section
        className="pt-20 pb-20 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #022c22 0%, #064e3b 50%, #047857 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            {copy.tag}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-5 tracking-tight">
            {copy.heading} <br />
            <span className="text-amber-300">{copy.headingHighlight}</span>
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            {copy.desc}
          </p>
        </div>
      </section>

      {/* ── STORY SECTION ── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-emerald-800 text-xs font-black uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                {copy.storyTag}
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-4 mb-5 tracking-tight">
                {copy.storyHeading}
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed font-normal text-sm sm:text-base">
                <p>{copy.storyP1}</p>
                <p>{copy.storyP2}</p>
                <p>{copy.storyP3}</p>
              </div>

              <Link
                to="/app"
                className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 bg-emerald-800 text-white font-extrabold rounded-xl hover:bg-emerald-700 transition-all shadow-md"
              >
                <span>{navCopy.getStarted}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Visual Card */}
            <div className="p-8 bg-gradient-to-br from-slate-50 to-emerald-50/50 rounded-3xl border border-slate-200">
              <h3 className="font-black text-xl text-slate-900 mb-6">{copy.missionHeading}</h3>
              <div className="space-y-5">
                {copy.values.map((v, idx) => {
                  const Icon = VALUE_ICONS[idx % VALUE_ICONS.length];
                  return (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{v.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY LEADERS CHOOSE US ── */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900">{copy.whyHeading}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {copy.whyItems.map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <h3 className="font-black text-sm text-slate-900">{item.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-7">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REAL STORE & PREMISES (GAJRAULA) ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-emerald-800 text-xs font-black uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Real Store Location · Gajraula
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-3 mb-2">
              Goyal Cattle Feed Store, Indra Chowk
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Kavi Nagar, near Indra Chowk, opposite Shuklapuri, Gajraula, Uttar Pradesh - 244235
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-3xl overflow-hidden border border-slate-200 shadow-md relative group">
              <img
                src="/images/goyal_shop_real.png"
                alt="Goyal Cattle Feed Store Front"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="font-black text-lg">गोयल कैटल फीड स्टोर - मुख्य दुकान व गोदाम</div>
                  <p className="text-xs text-amber-300 mt-1">
                    Authentic Store Facade · SP & Gavaksha Balanced Cattle Feed Hub
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex flex-col justify-between">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-amber-50 p-3 shadow-xs">
                <img
                  src="/images/banner_sp_pashu_aahar.png"
                  alt="SP Pashu Aahar"
                  className="w-full h-28 object-contain"
                />
                <div className="text-center pt-2">
                  <div className="font-extrabold text-xs text-slate-900">SP संतुलित पशु आहार</div>
                  <p className="text-[10px] text-slate-500">गाय - भैंस का सर्वोत्तम आहार</p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-emerald-50 p-3 shadow-xs">
                <img
                  src="/images/banner_gavaksha.png"
                  alt="Gavaksha Pashu Aahar"
                  className="w-full h-18 object-contain"
                />
                <div className="text-center pt-1">
                  <div className="font-extrabold text-xs text-slate-900">गवाक्ष पशु आहार</div>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/D8MwEcaxc7GNyc8r7"
                target="_blank"
                rel="noreferrer"
                className="block text-center py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                ⭐ Open in Google Maps (5.0 Rating)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP TEAM ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-2">{copy.teamHeading}</h2>
          <p className="text-sm text-slate-500 mb-12">{copy.teamSub}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-200/80 hover:shadow-lg transition-all">
                <div
                  className={`w-16 h-16 rounded-2xl ${member.color} text-amber-300 font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-md`}
                >
                  {member.avatar}
                </div>
                <div className="font-extrabold text-sm text-slate-900">{member.name}</div>
                <div className="text-[11px] text-slate-500 font-semibold mt-1 leading-tight">
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
            <div>
              <BrandLogo size="md" variant="white" className="mb-4" />
              <p className="text-xs text-slate-400 max-w-xs">{copy.desc}</p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3">Links</h4>
              <div className="space-y-2 text-xs font-semibold">
                <Link to="/" className="block hover:text-emerald-400">
                  Home
                </Link>
                <Link to="/about" className="block hover:text-emerald-400">
                  About Us
                </Link>
                <Link to="/app" className="block hover:text-emerald-400">
                  Sign In
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3">Address & Contact</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+91 98370 49021</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>goyalcattlefeed@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kavi Nagar, near Indra Chowk, Gajraula, UP 244235</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Goyal Cattle Feed Pvt. Ltd. · All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
