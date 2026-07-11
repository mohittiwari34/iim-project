import yahooFinance from 'yahoo-finance2';
import { config } from '../config/env.js';

// Helper to resolve ticker using Gemini if Yahoo is blocked
async function resolveTickerWithGemini(companyName) {
  try {
    const apiKey = config.geminiApiKey;
    if (!apiKey) throw new Error('No API Key');
    
    // We import dynamically to avoid circular dependencies
    const { ChatGoogleGenerativeAI } = await import('@langchain/google-genai');
    const llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: apiKey,
      temperature: 0,
    });
    
    const response = await llm.invoke(
      `Identify the stock ticker symbol for the company "${companyName}". Return ONLY the stock ticker symbol (e.g., AAPL, TSLA, MSFT). Do not include any other characters, punctuation, markdown formatting, or text.`
    );
    const ticker = response.content.trim().toUpperCase().replace(/[^A-Z]/g, '');
    if (ticker && ticker.length > 0 && ticker.length <= 6) {
      console.log(`[Resilience] Gemini resolved ticker for "${companyName}" to "${ticker}"`);
      return ticker;
    }
    throw new Error('Invalid ticker returned by Gemini');
  } catch (error) {
    console.error(`[Resilience] Gemini ticker resolution failed:`, error);
    throw new Error(`Failed to resolve stock ticker symbol for "${companyName}".`);
  }
}

/**
 * Searches Yahoo Finance for a company name and resolves its ticker symbol.
 * @param {string} companyName - The name of the company to search for.
 * @returns {Promise<string>} The ticker symbol (e.g., AAPL).
 */
export async function resolveTicker(companyName) {
  if (!companyName) {
    throw new Error('Company name is required');
  }

  try {
    const searchResults = await yahooFinance.search(companyName, {
      newsCount: 0,
    });

    if (!searchResults.quotes || searchResults.quotes.length === 0) {
      // Fallback to Gemini
      return await resolveTickerWithGemini(companyName);
    }

    // Prefer equity types on major exchanges
    const equityQuote = searchResults.quotes.find(
      (q) => q.quoteType === 'EQUITY' && q.symbol && !q.symbol.includes('.')
    ) || searchResults.quotes.find((q) => q.quoteType === 'EQUITY' && q.symbol) || searchResults.quotes[0];

    if (!equityQuote || !equityQuote.symbol) {
      return await resolveTickerWithGemini(companyName);
    }

    return equityQuote.symbol;
  } catch (error) {
    console.warn(`[Resilience] Yahoo Finance ticker search failed for "${companyName}". Falling back to Gemini...`);
    return await resolveTickerWithGemini(companyName);
  }
}

/**
 * Retrieves comprehensive financial data for a stock symbol.
 * @param {string} symbol - The stock symbol ticker (e.g., AAPL).
 * @returns {Promise<Object>} Object containing quotes and key financial data.
 */
export async function getCompanyFinancials(symbol) {
  if (!symbol) {
    throw new Error('Stock symbol is required');
  }

  const cleanSymbol = symbol.trim().toUpperCase();
  let quote = {};
  let summary = {};
  let fetchFailed = false;

  // Resilient quote fetch
  try {
    quote = await yahooFinance.quote(cleanSymbol);
  } catch (error) {
    console.warn(`[Resilience] Failed to fetch quote for ${cleanSymbol}:`, error.message);
    fetchFailed = true;
  }

  // Resilient summary fetch
  try {
    summary = await yahooFinance.quoteSummary(cleanSymbol, {
      modules: ['summaryProfile', 'financialData', 'defaultKeyStatistics'],
    });
  } catch (error) {
    console.warn(`[Resilience] Failed to fetch quoteSummary for ${cleanSymbol}:`, error.message);
    fetchFailed = true;
  }

  // If both failed, we return a structural placeholder with a warning so the agent uses Tavily
  if (fetchFailed && Object.keys(quote).length === 0 && Object.keys(summary).length === 0) {
    return {
      symbol: cleanSymbol,
      name: cleanSymbol,
      price: 'N/A',
      currency: 'USD',
      changePercent: 0,
      marketCap: 'N/A',
      peRatio: 'N/A',
      forwardPE: 'N/A',
      eps: 'N/A',
      industry: 'N/A',
      sector: 'N/A',
      businessSummary: 'N/A',
      financialData: {},
      keyStats: {},
      warning: `Yahoo Finance API is rate-limited (Too Many Requests). Do NOT rely on it. You MUST use the company_search tool to find the company's financial indicators on the web: Market Cap, Total Revenue, Net income, P/E ratio, and Industry.`
    };
  }

  return {
    symbol: cleanSymbol,
    name: quote.longName || quote.shortName || cleanSymbol,
    price: quote.regularMarketPrice || 'N/A',
    currency: quote.currency || 'USD',
    changePercent: quote.regularMarketChangePercent || 0,
    marketCap: quote.marketCap || summary.defaultKeyStatistics?.marketCap || 'N/A',
    peRatio: quote.trailingPE || summary.summaryDetail?.trailingPE || summary.defaultKeyStatistics?.trailingPE || 'N/A',
    forwardPE: quote.forwardPE || summary.summaryDetail?.forwardPE || summary.defaultKeyStatistics?.forwardPE || 'N/A',
    eps: quote.epsTrailingTwelveMonths || 'N/A',
    fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 'N/A',
    fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 'N/A',
    
    // Summary Profile
    industry: summary.summaryProfile?.industry || 'Unknown',
    sector: summary.summaryProfile?.sector || 'Unknown',
    businessSummary: summary.summaryProfile?.longBusinessSummary || '',
    
    // Financial Data
    financialData: {
      totalRevenue: summary.financialData?.totalRevenue,
      revenuePerShare: summary.financialData?.revenuePerShare,
      revenueGrowth: summary.financialData?.revenueGrowth,
      grossProfits: summary.financialData?.grossProfits,
      ebitda: summary.financialData?.ebitda,
      netIncome: summary.defaultKeyStatistics?.netIncomeToCommon,
      operatingCashflow: summary.financialData?.operatingCashflow,
      freeCashflow: summary.financialData?.freeCashflow,
      totalCash: summary.financialData?.totalCash,
      totalDebt: summary.financialData?.totalDebt,
      debtToEquity: summary.financialData?.debtToEquity,
      currentRatio: summary.financialData?.currentRatio,
      quickRatio: summary.financialData?.quickRatio,
      profitMargin: summary.financialData?.profitMargins,
      operatingMargin: summary.financialData?.operatingMargins,
      returnOnAssets: summary.financialData?.returnOnAssets,
      returnOnEquity: summary.financialData?.returnOnEquity,
    },
    
    // Key Statistics
    keyStats: {
      sharesOutstanding: summary.defaultKeyStatistics?.sharesOutstanding,
      floatShares: summary.defaultKeyStatistics?.floatShares,
      heldPercentInsiders: summary.defaultKeyStatistics?.heldPercentInsiders,
      heldPercentInstitutions: summary.defaultKeyStatistics?.heldPercentInstitutions,
      beta: summary.defaultKeyStatistics?.beta,
    }
  };
}
