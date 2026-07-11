import React from 'react';
import { CheckCircle2, XCircle, Award, Target, HelpCircle, ShieldAlert, Zap, TrendingUp, Heart } from 'lucide-react';

export default function RecommendationCard({
  recommendation,
  confidence,
  reason,
  financialHealth = 0,
  growth = 0,
  risk = 0,
  innovation = 0,
}) {
  const isInvest = recommendation === 'INVEST';

  // Calculate Overall Score based on metrics:
  // Risk is inverted (low risk is good, so 10 - risk)
  const overallScore = parseFloat(
    ((financialHealth + growth + innovation + (10 - risk)) / 4).toFixed(1)
  );

  const scores = [
    {
      name: 'Financial Health',
      score: financialHealth,
      icon: Heart,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500',
      bgLight: 'bg-emerald-500/10 dark:bg-emerald-500/5',
      desc: 'Balance sheet, cash flows & debt levels',
    },
    {
      name: 'Growth Prospects',
      score: growth,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-500',
      bgLight: 'bg-indigo-500/10 dark:bg-indigo-500/5',
      desc: 'Revenue and earnings growth potential',
    },
    {
      name: 'Risk Level',
      score: risk,
      icon: ShieldAlert,
      color: risk > 6 ? 'bg-red-500' : risk > 4 ? 'bg-amber-500' : 'bg-sky-500',
      textColor: risk > 6 ? 'text-red-500' : risk > 4 ? 'text-amber-500' : 'text-sky-500',
      bgLight: risk > 6 ? 'bg-red-500/10 dark:bg-red-500/5' : risk > 4 ? 'bg-amber-500/10 dark:bg-amber-500/5' : 'bg-sky-500/10 dark:bg-sky-500/5',
      desc: 'Competitors, regulatory & macro exposure (lower is safer)',
    },
    {
      name: 'Innovation & Tech',
      score: innovation,
      icon: Zap,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      bgLight: 'bg-purple-500/10 dark:bg-purple-500/5',
      desc: 'R&D intensity, patents & moat expansion',
    },
  ];

  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-lg relative">
      {/* Decorative colored top bar */}
      <div className={`h-2.5 w-full ${isInvest ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/60 dark:divide-slate-800/60">
        
        {/* LEFT PANEL: The Decision, Overall Score, and Confidence */}
        <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between items-center text-center space-y-6">
          <div className="w-full">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
              Agent Final Rating
            </span>

            {/* Recommendation Tag */}
            <div className="inline-flex items-center space-x-2">
              {isInvest ? (
                <div className="flex items-center space-x-2 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 px-6 py-3.5 rounded-2xl border border-emerald-500/20 shadow-sm shadow-emerald-500/5 animate-pulse">
                  <CheckCircle2 className="w-7 h-7" />
                  <span className="text-2xl font-black font-sans tracking-wider">INVEST</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-red-500/10 dark:bg-red-500/5 text-red-600 dark:text-red-400 px-6 py-3.5 rounded-2xl border border-red-500/20 shadow-sm shadow-red-500/5">
                  <XCircle className="w-7 h-7" />
                  <span className="text-2xl font-black font-sans tracking-wider">PASS</span>
                </div>
              )}
            </div>
          </div>

          {/* Dials Grid (Overall & Confidence) */}
          <div className="flex items-center justify-around w-full max-w-sm gap-4 py-4">
            
            {/* Overall Score Dial */}
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center w-28 h-28">
                {/* SVG circular track */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" strokeWidth="8" stroke="currentColor" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    strokeWidth="8"
                    stroke={isInvest ? '#10b981' : '#ef4444'}
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - overallScore / 10)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black font-sans tracking-tight leading-none text-slate-800 dark:text-slate-100">
                    {overallScore}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">
                    Score
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Overall Grade
              </span>
            </div>

            {/* Confidence Dial */}
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center w-28 h-28">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" strokeWidth="8" stroke="currentColor" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    strokeWidth="8"
                    stroke="#6366f1"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - confidence / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black font-sans tracking-tight leading-none text-slate-800 dark:text-slate-100">
                    {confidence}%
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">
                    Conf.
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Confidence
              </span>
            </div>

          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium px-4">
            * Ratings are calculated by weighted averages of financial health, innovation, and risk profiles.
          </div>
        </div>

        {/* RIGHT PANEL: Score Card and Thesis Narrative */}
        <div className="lg:col-span-7 p-6 md:p-8 space-y-6">
          
          {/* Detailed Narrative */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-brand-500" />
              <span>Investment Thesis & Rationale</span>
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium whitespace-pre-line">
              {reason || 'No analysis thesis generated.'}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-slate-200/50 dark:bg-slate-800/50"></div>

          {/* Dimension Scores Card */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              Dimension Assessment Scorecard
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scores.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div key={idx} className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <span className={`p-1 rounded-lg ${s.bgLight} ${s.textColor}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        {s.name}
                      </span>
                      <span className={`font-black ${s.textColor}`}>{s.score}/10</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${s.color} rounded-full`}
                        style={{ width: `${s.score * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-tight">
                      {s.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
