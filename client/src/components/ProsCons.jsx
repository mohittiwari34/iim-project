import React from 'react';
import { CheckCircle2, AlertOctagon, Sparkles, ShieldAlert } from 'lucide-react';

export default function ProsCons({ pros = [], cons = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pros Column */}
      <div className="glass-panel glass-panel-hover rounded-3xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 dark:bg-emerald-500/2 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="flex items-center space-x-2.5 mb-6">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-sans tracking-tight text-slate-800 dark:text-slate-100">
            Key Strengths & Pros
          </h3>
        </div>

        <ul className="space-y-4">
          {pros.length > 0 ? (
            pros.map((pro, index) => (
              <li key={index} className="flex items-start space-x-3 group/item">
                <div className="mt-1 flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 group-hover/item:scale-110 transition-transform" />
                </div>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {pro}
                </p>
              </li>
            ))
          ) : (
            <li className="text-slate-400 dark:text-slate-500 text-sm font-medium">No key strengths identified.</li>
          )}
        </ul>
      </div>

      {/* Cons Column */}
      <div className="glass-panel glass-panel-hover rounded-3xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 dark:bg-red-500/2 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-center space-x-2.5 mb-6">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/10 dark:bg-red-500/5 text-red-600 dark:text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-sans tracking-tight text-slate-800 dark:text-slate-100">
            Key Risks & Cons
          </h3>
        </div>

        <ul className="space-y-4">
          {cons.length > 0 ? (
            cons.map((con, index) => (
              <li key={index} className="flex items-start space-x-3 group/item">
                <div className="mt-1 flex-shrink-0">
                  <AlertOctagon className="w-5 h-5 text-red-500 group-hover/item:scale-110 transition-transform" />
                </div>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {con}
                </p>
              </li>
            ))
          ) : (
            <li className="text-slate-400 dark:text-slate-500 text-sm font-medium">No key risks identified.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
