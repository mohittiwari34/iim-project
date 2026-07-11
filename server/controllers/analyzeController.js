import { analyzeCompany } from '../langchain/agent.js';

/**
 * Controller to analyze a company.
 * POST /api/analyze
 * Body: { "company": "Apple" }
 */
export async function analyze(req, res, next) {
  try {
    const { company } = req.body;

    if (!company || typeof company !== 'string' || company.trim() === '') {
      const error = new Error('Invalid input: "company" name string is required in request body.');
      error.statusCode = 400;
      return next(error);
    }

    const cleanCompany = company.trim();
    console.log(`[HTTP] Initiating analysis request for company: "${cleanCompany}"`);

    const result = await analyzeCompany(cleanCompany);

    console.log(`[HTTP] Successfully completed analysis for company: "${cleanCompany}"`);
    return res.status(200).json(result);
  } catch (error) {
    console.error(`[HTTP] Analysis controller failed for "${req.body?.company}":`, error);
    // Let global error handler middleware send the response
    return next(error);
  }
}
