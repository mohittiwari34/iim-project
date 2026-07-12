import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';
import SearchBar from './components/SearchBar.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import CompanyOverviewCard from './components/CompanyOverviewCard.jsx';
import FinancialMetrics from './components/FinancialMetrics.jsx';
import ProsCons from './components/ProsCons.jsx';
import RecommendationCard from './components/RecommendationCard.jsx';
import NewsSection from './components/NewsSection.jsx';
import Footer from './components/Footer.jsx';
import { AlertCircle, FileSearch, Sparkles, TrendingUp } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [lastSearched, setLastSearched] = useState('');

  // Synchronize theme with class list on HTML document
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle the research API search
  const handleSearch = async (companyName) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setLastSearched(companyName);

    try {
      // Strip any trailing slash from VITE_API_URL to prevent double-slash (//) 404 errors in production
      const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const response = await axios.post(`${apiBaseUrl}/api/analyze`, {
        company: companyName,
      });
      
      setResults(response.data);
    } catch (err) {
      console.error('API Error details:', err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        'Failed to connect to the backend server. Make sure the server is running.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Glow elements in background for dark mode */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full radial-glow pointer-events-none opacity-20 dark:opacity-10"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full radial-glow pointer-events-none opacity-10 dark:opacity-5" style={{ '--glow-color': 'rgba(99, 102, 241, 0.15)' }}></div>

      {/* Header Area */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10 z-10">
        
        {/* Intro Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Equity Valuation</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-sans tracking-tight leading-tight">
            Research Investment Ideas{' '}
            <span className="bg-gradient-to-r from-brand-500 via-indigo-500 to-indigo-600 bg-clip-text text-transparent">
              With AI Confidence
            </span>
          </h1>
          <p className="text-base md:text-lg font-medium text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Instantly map company names to real-time financials, search general news, evaluate risks, and get an automated rating from a LangChain research agent.
          </p>
        </section>

        {/* Input Form */}
        <section className="pb-4">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Error State */}
        {error && (
          <section className="max-w-2xl mx-auto transform animate-fade-in">
            <div className="p-6 rounded-3xl border border-red-500/20 bg-red-500/5 text-red-700 dark:text-red-400 flex items-start space-x-4 shadow-lg shadow-red-500/5">
              <AlertCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="text-base font-bold font-sans">Research Analysis Failed</h4>
                <p className="text-sm font-medium leading-relaxed opacity-90">{error}</p>
                <button
                  onClick={() => handleSearch(lastSearched)}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-500 transition shadow-md shadow-red-600/10 outline-none"
                >
                  Retry Analysis
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {isLoading && (
          <section className="py-6">
            <LoadingSpinner />
          </section>
        )}

        {/* Results Dashboard Grid */}
        {results && !isLoading && !error && (
          <section className="space-y-8 animate-fade-in">
            {/* Top row cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column - Company Overview */}
              <div className="lg:col-span-4 flex">
                <div className="w-full flex">
                  <CompanyOverviewCard
                    company={results.company}
                    industry={results.industry}
                    summary={results.summary}
                  />
                </div>
              </div>

              {/* Right Column - Investment Thesis & Ratings */}
              <div className="lg:col-span-8 flex">
                <div className="w-full flex">
                  <RecommendationCard
                    recommendation={results.recommendation}
                    confidence={results.confidence}
                    reason={results.reason}
                    financialHealth={results.financialHealth}
                    growth={results.growth}
                    risk={results.risk}
                    innovation={results.innovation}
                  />
                </div>
              </div>

            </div>

            {/* Middle Row - Financial Metrics Cards */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
                <TrendingUp className="w-4 h-4 text-brand-500" />
                <span>Financial Indicators</span>
              </h3>
              <FinancialMetrics
                marketCap={results.marketCap}
                revenue={results.revenue}
                profit={results.profit}
                peRatio={results.peRatio}
              />
            </div>

            {/* Pros and Cons lists */}
            <ProsCons pros={results.pros} cons={results.cons} />

            {/* News coverage */}
            <NewsSection news={results.news} />
          </section>
        )}

        {/* Default Welcome Screen */}
        {!results && !isLoading && !error && (
          <section className="max-w-lg mx-auto py-16 text-center space-y-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mx-auto">
              <FileSearch className="w-9 h-9 text-slate-400 dark:text-slate-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-sans text-slate-800 dark:text-slate-100">
                Ready for Analysis
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Enter a company name above or click one of the suggested companies. ValuationAI will fetch active financials and search reports.
              </p>
            </div>
          </section>
        )}

      </main>

      {/* Footer Area */}
      <Footer />
    </div>
  );
}
