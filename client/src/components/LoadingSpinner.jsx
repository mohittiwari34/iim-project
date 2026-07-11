import React, { useState, useEffect } from 'react';
import { Loader2, Search, BarChart3, BrainCircuit, CheckCircle2 } from 'lucide-react';

const STAGES = [
  { text: 'Booting LangChain investment agent...', icon: BrainCircuit, duration: 2500 },
  { text: 'Resolving company ticker and fetching financial quotes...', icon: BarChart3, duration: 3500 },
  { text: 'Searching Tavily API for recent news and announcements...', icon: Search, duration: 3000 },
  { text: 'Evaluating competitor landscape & market positioning...', icon: Search, duration: 3000 },
  { text: 'Synthesizing SWOT analysis using Gemini 1.5...', icon: BrainCircuit, duration: 4000 },
  { text: 'Compiling structured JSON recommendation card...', icon: BrainCircuit, duration: 3000 },
];

export default function LoadingSpinner() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    let timer;
    const runStageTransition = (index) => {
      if (index < STAGES.length - 1) {
        timer = setTimeout(() => {
          setCurrentStageIndex(index + 1);
          runStageTransition(index + 1);
        }, STAGES[index].duration);
      }
    };
    runStageTransition(0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto py-16 flex flex-col items-center text-center space-y-6">
      {/* Animated Glowing Ring */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 w-24 h-24 rounded-full bg-brand-500/10 blur-xl animate-pulse-slow"></div>
        <div className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-brand-500 dark:border-t-brand-500 animate-spin flex items-center justify-center shadow-lg">
          <BrainCircuit className="w-8 h-8 text-brand-500 animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold font-sans text-slate-800 dark:text-slate-100">
          Agent Researching Company...
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm px-4">
          This takes 10-15 seconds as the agent invokes multiple search, financial, and reasoning tools.
        </p>
      </div>

      {/* Stage Timeline */}
      <div className="w-full max-w-xs bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 text-left shadow-sm">
        <div className="space-y-4">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < currentStageIndex;
            const isActive = idx === currentStageIndex;
            const isPending = idx > currentStageIndex;

            return (
              <div key={idx} className="flex items-start space-x-3 transition-opacity duration-300">
                <div className="mt-0.5">
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                  {isActive && (
                    <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
                  )}
                  {isPending && (
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"></div>
                  )}
                </div>
                <span
                  className={`text-xs font-semibold font-sans transition-all duration-300 ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 scale-[1.01]'
                      : isCompleted
                      ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-200 dark:decoration-slate-800/50'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                >
                  {stage.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
