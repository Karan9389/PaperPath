import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error('Missing API key. Set GOOGLE_API_KEY in your environment.');
}

const requestedModel = process.env.GEMINI_MODEL?.trim();

const defaultModel = "gemini-3.5-flash"; 

const model = requestedModel && requestedModel !== "gemini-1.5-flash" && requestedModel !== "gemini-1.5-pro"
    ? requestedModel
    : defaultModel;

if (requestedModel === "gemini-1.5-flash") {
    console.warn("GEMINI_MODEL=gemini-1.5-flash is unsupported for generateContent on this API version; using", defaultModel);
}

console.log("Using Gemini model:", model);
console.log("Gemini API key loaded:", !!apiKey);

// We initialize the LLM here so we can import this single instance
// anywhere in our app without having to reconfigure it every time.
const llm = new ChatGoogleGenerativeAI({
    model: model,
    maxOutputTokens: 2048,
    apiKey,
});
export default llm;