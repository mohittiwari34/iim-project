import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables from server root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const requiredEnv = ['GEMINI_API_KEY', 'TAVILY_API_KEY'];

// Check for missing keys during startup
const missingEnv = requiredEnv.filter((key) => !process.env[key] || process.env[key].includes('YOUR_'));

if (missingEnv.length > 0) {
  console.warn(
    `[WARNING]: Missing or placeholder environment variables detected: ${missingEnv.join(', ')}. Please update server/.env with your actual API keys.`
  );
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  geminiApiKey: (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, ''),
  tavilyApiKey: (process.env.TAVILY_API_KEY || '').trim().replace(/^["']|["']$/g, ''),
  nodeEnv: process.env.NODE_ENV || 'development',
};
