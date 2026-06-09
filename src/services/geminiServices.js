import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from 'dotenv';

dotenv.config();

// We initialize the LLM here so we can import this single instance 
// anywhere in our app without having to reconfigure it every time.
const llm = new ChatGoogleGenerativeAI({
    modelName: "gemini-1.5-flash", // We use flash because it is incredibly fast and perfect for text manipulation
    maxOutputTokens: 2048,
    apiKey: process.env.GEMINI_API_KEY,
});

export default llm;