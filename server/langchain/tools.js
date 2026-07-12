import { tool } from '@langchain/core/tools';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { getCompanyFinancials, resolveTicker } from '../services/yahooFinanceService.js';
import { config } from '../config/env.js';

/**
 * Tool 1: Company Search (Tavily Search API)
 * Performs web searches for news, competition, and general company research.
 */
export const tavilySearchTool = tool(
  async ({ query }) => {
    try {
      const apiKey = config.tavilyApiKey;
      if (!apiKey) {
        return 'Error: TAVILY_API_KEY environment variable is missing.';
      }

      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: apiKey,
          query: query,
          search_depth: 'advanced',
          max_results: 5,
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavily API responded with status ${response.status}`);
      }

      const data = await response.json();
      const results = data.results || [];
      
      if (results.length === 0) {
        return `No web results found for search query: "${query}"`;
      }

      const formattedResults = results
        .map((r, i) => `[${i + 1}] Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}\n`)
        .join('\n');

      return formattedResults;
    } catch (error) {
      console.error('Tavily Search Tool Error:', error);
      return `Error performing web search: ${error.message}`;
    }
  },
  {
    name: 'company_search',
    description: 'Search the web for recent news, press releases, company operations, management changes, product launches, competitor updates, and SWOT signals.',
    schema: z.object({
      query: z.string().describe('The web search query. Make it descriptive and relevant to the company or sector.'),
    }),
  }
);

/**
 * Tool 2: Yahoo Finance Tool
 * Retrieves financial statements, price, PE ratio, market cap, and other balance sheet/income metrics.
 */
export const yahooFinanceTool = tool(
  async ({ companyNameOrTicker }) => {
    try {
      let symbol = companyNameOrTicker.trim().toUpperCase();

      // Check if it is a company name (usually contains spaces or is longer, not a standard ticker like AAPL, TSLA)
      const isTickerPattern = /^[A-Z]{1,5}$/.test(symbol);
      if (!isTickerPattern) {
        // Resolve company name to ticker first
        symbol = await resolveTicker(companyNameOrTicker);
      }

      const financials = await getCompanyFinancials(symbol);
      return JSON.stringify(financials, null, 2);
    } catch (error) {
      console.error('Yahoo Finance Tool Error:', error);
      return `Error retrieving financial metrics for "${companyNameOrTicker}": ${error.message}`;
    }
  },
  {
    name: 'yahoo_finance',
    description: 'Retrieve real-time and historical stock performance, price, PE ratio, market cap, revenue growth, profit margin, debt-to-equity ratio, and quick/current ratio. Accepts a company name or ticker symbol.',
    schema: z.object({
      companyNameOrTicker: z.string().describe('The company name (e.g. Apple) or stock ticker (e.g. AAPL).'),
    }),
  }
);

/**
 * Tool 3: Gemini Analysis Tool
 * Uses Gemini model to analyze the gathered raw information under specific aspects (e.g., SWOT, business model).
 */
export const geminiAnalysisTool = tool(
  async ({ rawData, aspect }) => {
    console.log(`[TOOL: gemini_analysis] Starting sub-analysis aspect: "${aspect}"`);
    try {
      const apiKey = config.geminiApiKey;
      if (!apiKey) {
        console.warn(`[TOOL: gemini_analysis] Missing GEMINI_API_KEY config`);
        return 'Error: GEMINI_API_KEY environment variable is missing.';
      }

      const llm = new ChatGoogleGenerativeAI({
        model: 'gemini-2.5-flash',
        apiKey: apiKey,
        temperature: 0.1,
      });

      const prompt = `
You are a Lead Financial Analyst. Analyze the raw financial and search data provided below specifically focusing on the aspect of "${aspect}".
Identify key signals, strength of indicators, potential red flags, and competitive advantages related to this aspect.

Raw Data:
${rawData}

Please write a highly detailed, concise, and structured analysis of the company's "${aspect}".
`;

      const response = await llm.invoke(prompt);
      return response.content;
    } catch (error) {
      console.error('Gemini Analysis Tool Error:', error);
      return `Error performing Gemini sub-analysis: ${error.message}`;
    }
  },
  {
    name: 'gemini_analysis',
    description: 'Synthesize and analyze raw data using Gemini AI. Good for deep-dives into aspects like: "Business Model", "Competition & Market Position", "Financial Health Analysis", "Innovation & Future Growth", or "Risks & Red Flags".',
    schema: z.object({
      rawData: z.string().describe('The collected raw text/finance data to analyze.'),
      aspect: z.enum([
        'Business Model',
        'Competition & Market Position',
        'Financial Health Analysis',
        'Innovation & Future Growth',
        'Risks & Red Flags',
      ]).describe('The specific aspect of the company to analyze.'),
    }),
  }
);

// Group tools
export const allTools = [tavilySearchTool, yahooFinanceTool, geminiAnalysisTool];
