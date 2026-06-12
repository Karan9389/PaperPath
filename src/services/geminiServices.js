import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from 'dotenv';

dotenv.config();

// We initialize the LLM here so we can import this single instance
// anywhere in our app without having to reconfigure it every time.
const llm = new ChatGoogleGenerativeAI({
<<<<<<< HEAD
    model: "gemini-1.5-flash", // We use flash because it is incredibly fast and perfect for text manipulation
=======
    model: "gemini-1.5-flash", // `model` is required by @langchain/google-genai
>>>>>>> a1ef04e21e4fab27b8c4c504f13c0a1425beea54
    maxOutputTokens: 2048,
    apiKey: process.env.GEMINI_API_KEY,
});
export default llm;