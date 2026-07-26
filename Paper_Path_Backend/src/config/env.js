/**
 * env.js — MUST be the very first import in server.js.
 *
 * ES module imports are hoisted and resolved before any top-level code runs.
 * This dedicated module ensures dotenv is configured before any other module
 * (like mailer.js) tries to read process.env.
 */
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Try <backend>/.env first, then fall back to root ../.env
const envPath         = path.resolve(__dirname, '../../.env');
const fallbackEnvPath = path.resolve(__dirname, '../../../.env');

const result = dotenv.config({ path: envPath });
if (result.error) {
    dotenv.config({ path: fallbackEnvPath });
}

console.log('[Env] ✅  Environment variables loaded.');
