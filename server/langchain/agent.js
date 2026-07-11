import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { z } from 'zod';
import { allTools } from './tools.js';
import { config } from '../config/env.js';

// Define the response schema using Zod
export const analysisResponseSchema = z.object({
  company: z.string().describe('The official standard name of the company (e.g. Apple Inc., Tesla, Inc.)'),
  industry: z.string().describe('The primary industry sector the company operates in (e.g. Technology, Consumer Electronics, Automakers)'),
  summary: z.string().describe('A 2-3 sentence overview of the company\'s core business model, products, and services.'),
  marketCap: z.string().describe('The market capitalization formatted with currency symbols and units (e.g. $3.45 Trillion)'),
  revenue: z.string().describe('The total revenue (annual or trailing twelve months) formatted with units (e.g. $385.6 Billion)'),
  profit: z.string().describe('The net profit/income (annual or trailing twelve months) formatted with units (e.g. $97.0 Billion)'),
  peRatio: z.string().describe('The trailing P/E ratio formatted as a string (e.g. 31.5) or "N/A" if negative/invalid'),
  financialHealth: z.number().int().min(0).max(10).describe('An integer score from 0 (very poor) to 10 (exceptionally strong) representing the company\'s balance sheet stability, debt level, and free cash flows.'),
  growth: z.number().int().min(0).max(10).describe('An integer score from 0 to 10 indicating historical and future growth potential in sales, earnings, and market share.'),
  risk: z.number().int().min(0).max(10).describe('An integer score from 0 to 10 representing risk levels (where 10 is high risk/volatility and 0 is extremely low risk/stable utility).'),
  innovation: z.number().int().min(0).max(10).describe('An integer score from 0 to 10 indicating research & development intensity, technology pipeline, patents, and future positioning.'),
  pros: z.array(z.string()).min(2).describe('A list of at least 2 distinct key positive investment arguments, strengths, or competitive moats.'),
  cons: z.array(z.string()).min(2).describe('A list of at least 2 distinct key negative factors, risks, bottlenecks, or valuation concerns.'),
  news: z.array(
    z.object({
      title: z.string().describe('The headline of a relevant recent news article.'),
      url: z.string().describe('The URL of the news article.'),
      summary: z.string().describe('A 1-2 sentence summary of what the article is about and why it matters to the company.'),
    })
  ).describe('A list of 3-5 recent major news developments for the company.'),
  recommendation: z.enum(['INVEST', 'PASS']).describe('The final investment decision: either INVEST or PASS.'),
  confidence: z.number().int().min(0).max(100).describe('An integer percentage (0-100) indicating the confidence level in this recommendation.'),
  reason: z.string().describe('A detailed paragraph explaining why this decision was reached, referencing specific metrics, risks, and growth drivers.'),
});

/**
 * Main function to execute the AI Research Agent.
 * @param {string} companyName - The name of the company to analyze.
 * @returns {Promise<Object>} The structured JSON output conforming to analysisResponseSchema.
 */
export async function analyzeCompany(companyName) {
  if (!companyName) {
    throw new Error('Company name is required for analysis');
  }

  const apiKey = config.geminiApiKey;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }

  try {
    // 1. Initialize Gemini LLM
    const llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: apiKey,
      temperature: 0.2,
    });

    // 2. Build the Agent's Prompt
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a Senior Investment Research Agent. Your job is to research the requested company and provide a detailed analysis of its business model, financial metrics, recent news, competitors, and risks.

You have access to the following tools:
1. \`yahoo_finance\`: Use this to get live quotes, profile, and key financial ratios (Market Cap, Revenue, Profit, Debt/Equity, P/E ratio, etc.). Always query this first to establish financial facts.
2. \`company_search\`: Use this to find recent news, competitor landscape, innovation announcements, or risks on the web.
3. \`gemini_analysis\`: Use this to perform deep-dive analysis on specific aspects of the data you have gathered (e.g. SWOT, Growth, Financial Health, Risks).

Follow this workflow:
- Step 1: Query \`yahoo_finance\` to fetch financial facts.
- Step 2: Use \`company_search\` to gather news, competitive developments, and innovations.
- Step 3: Run \`gemini_analysis\` on key aspects (such as Financial Health, Risks, and Innovation) to synthesize your findings.
- Step 4: Combine all your notes and metrics into a detailed research report summarizing the company's status, pros, cons, and investment thesis.

Be thorough, detailed, and analytical.`,
      ],
      ['human', 'Please perform a comprehensive investment analysis on: {input}'],
      ['placeholder', '{agent_scratchpad}'],
    ]);

    // 3. Create the LangChain Agent and Executor
    const agent = createToolCallingAgent({
      llm,
      tools: allTools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools: allTools,
      verbose: true,
      maxIterations: 8,
    });

    // 4. Run the Research Loop
    console.log(`Starting LangChain agent research for: "${companyName}"...`);
    const researchResult = await agentExecutor.invoke({
      input: companyName,
    });

    console.log('Research complete. Synthesizing structured JSON output...');

    // 5. Structure the gathered research into the target JSON format
    let finalResult;
    try {
      const structuredModel = llm.withStructuredOutput(analysisResponseSchema);
      
      const compilationPrompt = `
You are a Professional Investment Analyst. Your task is to compile the research report generated by our agent into the required structured JSON format.

Review the research output below, extract the financials, news, pros/cons, and metrics, and formulate the final investment recommendation:
- The recommendation must be "INVEST" only if the business is strong, has low/manageable risk, reasonable valuation (P/E ratio), and clear growth drivers. Otherwise, choose "PASS".
- Assign scores out of 10 for: Financial Health, Growth, Risk (0 means low risk, 10 means high risk), and Innovation.
- Assign a confidence score from 0 to 100%.

Research Report:
${researchResult.output}

Provide the final JSON response. Keep descriptions and reasoning professional, concise, and backed by the figures in the report.
`;

      finalResult = await structuredModel.invoke(compilationPrompt);
    } catch (parseError) {
      console.warn('[Resilience] Structured output tool-calling failed. Retrying with JSON-mode fallback...', parseError.message);
      
      const jsonLlm = new ChatGoogleGenerativeAI({
        model: 'gemini-2.5-flash',
        apiKey: apiKey,
        temperature: 0.1,
        modelKwargs: {
          responseMimeType: "application/json",
        },
      });
      
      const fallbackPrompt = `
You are a Professional Investment Analyst. Your task is to compile the research report generated by our agent into a raw JSON object matching the exact schema below.

Research Report:
${researchResult.output}

You MUST return ONLY a raw JSON object matching this schema structure. Do not wrap it in markdown, do not include code block ticks (\`\`\`), and do not add any explanations or extra characters.

Schema details:
{
  "company": "Official company name",
  "industry": "Primary industry sector",
  "summary": "2-3 sentence overview of business",
  "marketCap": "Market capitalization value (e.g. $3.45 Trillion or N/A)",
  "revenue": "Total revenue value (e.g. $385.6 Billion or N/A)",
  "profit": "Net profit value (e.g. $97.0 Billion or N/A)",
  "peRatio": "Price-to-Earnings ratio (e.g. 31.5 or N/A)",
  "financialHealth": number (0 to 10),
  "growth": number (0 to 10),
  "risk": number (0 to 10),
  "innovation": number (0 to 10),
  "pros": ["strength 1", "strength 2"],
  "cons": ["risk 1", "risk 2"],
  "news": [{"title": "news title", "url": "URL", "summary": "1-2 sentence summary"}],
  "recommendation": "INVEST" or "PASS",
  "confidence": number (0 to 100),
  "reason": "Detailed paragraph explaining reasoning"
}
`;
      const fallbackResponse = await jsonLlm.invoke(fallbackPrompt);
      const textContent = fallbackResponse.content.trim();
      
      // Clean up markdown block wraps if model generated them anyway
      const jsonString = textContent
        .replace(/^```json/i, '')
        .replace(/^```/, '')
        .replace(/```$/, '')
        .trim();

      finalResult = JSON.parse(jsonString);
    }
    
    // Fallback: Ensure name matches query if not found
    if (!finalResult.company) {
      finalResult.company = companyName;
    }

    return finalResult;
  } catch (error) {
    console.error('Error during AI Analysis:', error);
    throw new Error(`AI Analysis failed: ${error.message}`);
  }
}
