// src/controllers/aiController.js
import { GoogleGenAI } from '@google/genai';

const testGeminiConnection = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Please provide a prompt in the request body.' });
        }

        // 🎯 Initialize inside the execution handler block
        const llm = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await llm.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ 
            success: true, 
            answer: response.text 
        });
    } catch (error) {
        console.error("Gemini Connection Error:", error);
        res.status(500).json({ message: "AI connection failed", error: error.message });
    }
};

export { testGeminiConnection };