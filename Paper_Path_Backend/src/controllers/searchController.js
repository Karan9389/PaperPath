// src/controllers/searchController.js
import paperModel from '../models/paper.js';

export const searchAndSummarize = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ message: "Please provide a question." });
        }

        // 1. Embed the user's question using the local Ollama model
        const queryVectorResponse = await fetch('http://localhost:11434/api/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                model: 'nomic-embed-text', 
                prompt: question 
            })
        });
        
        if (!queryVectorResponse.ok) throw new Error("Local embedding failed.");
        const { embedding } = await queryVectorResponse.json();

        // 2. Search MongoDB Atlas using Vector Search
        // Note: We search inside the 'chunks.embedding' path for PDFs
        const searchResults = await paperModel.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_index", 
                    "path": "chunks.embedding",
                    "queryVector": embedding,
                    "numCandidates": 100,
                    "limit": 3
                }
            }
        ]);

        if (searchResults.length === 0) {
            return res.json({ answer: "I couldn't find any relevant papers in the database for that question." });
        }

        // 3. Extract the relevant text
        const contextText = searchResults.map(doc => doc.chunks[0].text).join("\n\n---\n\n");

        // 4. Ask the local Llama3 model to summarize
        const aiResponse = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3',
                prompt: `You are a helpful academic assistant. Answer the user's question clearly for a beginner based ONLY on the following excerpts.\n\nExcerpts:\n${contextText}\n\nQuestion: ${question}`,
                stream: false
            })
        });

        const finalData = await aiResponse.json();

        res.json({ 
            success: true, 
            answer: finalData.response,
            sourcesFound: searchResults.length
        });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ message: "Failed to process search", error: error.message });
    }
};