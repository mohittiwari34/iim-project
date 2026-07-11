import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm transition-colors duration-300 py-6 mt-16 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          &copy; {currentYear} ValuationAI Inc. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <span className="hover:text-brand-500 transition-colors">Privacy Policy</span>
          <span>&middot;</span>
          <span className="hover:text-brand-500 transition-colors">Terms of Service</span>
          <span>&middot;</span>
          <span className="hover:text-brand-500 transition-colors">API Documentation</span>
        </div>
      </div>
    </footer>
  );
}
