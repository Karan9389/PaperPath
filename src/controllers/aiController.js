// src/controllers/aiController.js
import llm from '../services/geminiService.js';

// @desc    Test the Gemini API connection
// @route   POST /api/ai/test
// @access  Public (for now)
const testGeminiConnection = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Please provide a prompt in the request body.' });
        }

        // The .invoke() method sends the text to the AI and waits for the response
        const aiResponse = await llm.invoke(prompt);

        // LangChain wraps the response in an object, the actual text is inside .content
        res.json({ 
            success: true, 
            answer: aiResponse.content 
        });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ message: "AI connection failed", error: error.message });
    }
};

export { testGeminiConnection };