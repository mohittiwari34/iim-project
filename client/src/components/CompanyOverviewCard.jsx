import React from 'react';
import { Building2, Info, ArrowUpRight } from 'lucide-react';

export default function CompanyOverviewCard({ company, industry, summary }) {
  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brand-500/5 blur-2xl pointer-events-none group-hover:bg-brand-500/10 transition-colors"></div>

      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-sans tracking-tight text-slate-800 dark:text-slate-100">
                {company}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-100/50 dark:border-brand-900/20">
                  {industry || 'Sector Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-200/50 dark:bg-slate-800/50"></div>

        {/* Company Summary */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" />
            <span>Business Profile</span>
          </div>
          <p className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
            {summary || 'No summary details compiled for this company.'}
          </p>
        </div>
      </div>

      {/* Decorative footer line */}
      <div className="mt-6 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800/40">
        <span>AI Generated Summary</span>
        <span className="flex items-center text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
          Source: Tavily & Yahoo Finance <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
        </span>
      </div>
    </div>
  );
}
