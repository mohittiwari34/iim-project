import React from 'react';
import { Newspaper, ExternalLink, Calendar } from 'lucide-react';

export default function NewsSection({ news = [] }) {
  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-800/50">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400">
          <Newspaper className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold font-sans tracking-tight text-slate-800 dark:text-slate-100">
          Latest Developments & News
        </h3>
      </div>

      <div className="space-y-4">
        {news.length > 0 ? (
          news.map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/40 hover:border-brand-500/20 hover:bg-white dark:hover:bg-slate-900/60 transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Recent Source</span>
                </div>
                <h4 className="text-sm md:text-base font-bold font-sans text-slate-800 dark:text-slate-100 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {item.summary}
                </p>
              </div>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-all shadow-sm self-start sm:self-center"
                >
                  <span>Read Article</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium py-4 text-center">
            No recent news stories found for this company.
          </p>
        )}
      </div>
    </div>
  );
}
