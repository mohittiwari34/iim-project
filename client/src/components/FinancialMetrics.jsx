import React from 'react';
import { DollarSign, Landmark, Percent, Receipt } from 'lucide-react';

export default function FinancialMetrics({ marketCap, revenue, profit, peRatio }) {
  const metrics = [
    {
      title: 'Market Capitalization',
      value: marketCap || 'N/A',
      desc: 'Total equity valuation',
      icon: Landmark,
      colorClass: 'text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/5',
      borderGlow: 'hover:border-indigo-500/30 shadow-indigo-500/5',
    },
    {
      title: 'Revenue',
      value: revenue || 'N/A',
      desc: 'Top-line sales performance',
      icon: Receipt,
      colorClass: 'text-sky-500 bg-sky-500/10 dark:bg-sky-500/5',
      borderGlow: 'hover:border-sky-500/30 shadow-sky-500/5',
    },
    {
      title: 'Net Profit',
      value: profit || 'N/A',
      desc: 'Bottom-line earnings summary',
      icon: DollarSign,
      colorClass: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5',
      borderGlow: 'hover:border-emerald-500/30 shadow-emerald-500/5',
    },
    {
      title: 'P/E Ratio',
      value: peRatio || 'N/A',
      desc: 'Price-to-Earnings valuation multiplier',
      icon: Percent,
      colorClass: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/5',
      borderGlow: 'hover:border-amber-500/30 shadow-amber-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;

        return (
          <div
            key={index}
            className={`glass-panel rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 border border-slate-200/50 dark:border-slate-800/50 ${metric.borderGlow}`}
          >
            <div className="flex items-center justify-between space-x-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {metric.title}
                </span>
                <span className="text-xl md:text-2xl font-bold font-sans tracking-tight text-slate-800 dark:text-slate-100 block">
                  {metric.value}
                </span>
              </div>
              <div className={`flex items-center justify-center w-11 h-11 rounded-2xl ${metric.colorClass}`}>
                <Icon className="w-5.5 h-5.5" />
              </div>
            </div>
            
            {/* Divider */}
            <div className="my-3 h-px w-full bg-slate-200/40 dark:bg-slate-800/40"></div>

            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {metric.desc}
            </span>
          </div>
        );
      })}
    </div>
  );
}
