import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PlaceholderPageProps {
  title: string;
  category: string;
  description: string;
  phase: string;
  plannedFeatures: string[];
  icon: any;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  category,
  description,
  phase,
  plannedFeatures,
  icon: IconComp,
}) => {
  const { setActiveQuickAction } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <NavLink
          to="/"
          className="flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </NavLink>
        <span className="font-mono">{category} · {phase}</span>
      </div>

      {/* Main card */}
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs ring-1 ring-emerald-600/20">
              <IconComp className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {title}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {phase}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => setActiveQuickAction('create_sales_bill')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-colors"
            >
              Quick Action Entry
            </button>
          </div>
        </div>

        {/* Roadmap & Architecture Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-700" /> Planned Architectural Capabilities
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {plannedFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Future Phase Note */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>This module's deep transactional screens will be implemented in subsequent phases.</span>
          </div>
          <NavLink
            to="/"
            className="text-emerald-800 dark:text-emerald-400 font-semibold hover:underline"
          >
            Go to Executive Dashboard →
          </NavLink>
        </div>
      </div>
    </div>
  );
};
