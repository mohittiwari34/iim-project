import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

const SUGGESTIONS = ['Apple', 'Tesla', 'Microsoft', 'Nvidia', 'Amazon'];

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (name) => {
    if (!isLoading) {
      setQuery(name);
      onSearch(name);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-0 -m-0.5 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-2xl opacity-20 group-focus-within:opacity-100 group-hover:opacity-40 transition-opacity duration-300 blur-sm pointer-events-none"></div>
        
        <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-100 dark:shadow-none transition-all duration-300">
          <div className="pl-5 text-slate-400 dark:text-slate-500">
            <Search className="w-5.5 h-5.5" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter company name (e.g. Apple, Nvidia, Microsoft)..."
            disabled={isLoading}
            className="w-full py-4.5 px-4 bg-transparent outline-none text-base font-sans text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-60"
          />

          <div className="pr-3 flex items-center">
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-md shadow-brand-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-98"
            >
              <span>Analyze</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Quick Searches */}
      <div className="flex flex-wrap items-center gap-2 justify-center text-sm">
        <span className="text-slate-400 dark:text-slate-500 font-medium">Try:</span>
        {SUGGESTIONS.map((company) => (
          <button
            key={company}
            type="button"
            onClick={() => handleSuggestionClick(company)}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-brand-500/40 hover:text-brand-600 dark:hover:text-brand-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          >
            {company}
          </button>
        ))}
      </div>
    </div>
  );
}
