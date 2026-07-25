import fs from 'fs';
import csv from 'csv-parser';
import paperModel from '../models/paper.js';
import PDFParser from 'pdf2json';

// 🧠 Helper: Talk directly to your local Ollama on Port 11434
async function getLocalEmbedding(text) {
    const response = await fetch('http://localhost:11434/api/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'nomic-embed-text', prompt: text })
    });
    const data = await response.json();
    return data.embedding;
}

// ✂️ Helper: Chop massive PDFs into smaller, readable paragraphs
function chunkText(text, chunkSize = 1000) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
}

// 📄 PDF INGESTION PIPELINE
export const processPdfAndIngest = async (pdfBuffer, title, pdfUrl = null) => {
    console.log(`🤖 Parsing PDF: ${title}...`);
    
    // 🚀 THE FIX: Use pdf2json in "Text Only" mode (the '1' parameter)
    const rawText = await new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);
        
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => {
            resolve(pdfParser.getRawTextContent());
        });
        
        pdfParser.parseBuffer(pdfBuffer);
    });

    // Clean up the text for the AI (remove weird line breaks)
    const cleanText = rawText.replace(/\r\n/g, ' ').trim();
    
    const textChunks = chunkText(cleanText, 1000);
    console.log(`🤖 Processing ${textChunks.length} chunks via LOCAL OLLAMA...`);

    const embeddedChunks = [];
    for (let i = 0; i < textChunks.length; i++) {
        const embedding = await getLocalEmbedding(textChunks[i]);
        embeddedChunks.push({ text: textChunks[i], embedding: embedding });
        if (i % 50 === 0) console.log(`  ...embedded ${i}/${textChunks.length} chunks`);
    }

    const newPaper = new paperModel({
        title: title,
        abstract: cleanText.substring(0, 500) + '...',
        difficultyLevel: 'Intermediate',
        tags: ['PDF', 'Uploaded'],
        content: cleanText,
        pdfUrl: pdfUrl,
        chunks: embeddedChunks
    });

    await newPaper.save();
    console.log(`✅ Successfully saved "${title}" to MongoDB Atlas!`);
    return newPaper;
};

// 📊 CSV INGESTION PIPELINE
export const processCsvStream = async (filePath) => {
    console.log(`🤖 Processing CSV via LOCAL OLLAMA...`);
    
    return new Promise((resolve, reject) => {
        let count = 0;
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                console.log(`Found ${results.length} rows. Starting local embeddings...`);
                
                for (const row of results) {
                    const title = row.title || row.Title || 'Unknown CSV Paper';
                    const abstract = row.abstract || row.Abstract || title;
                    
                    let embedding = [];
                    try {
                        embedding = await getLocalEmbedding(abstract);
                    } catch (e) {
                        console.warn(`Local embedding failed for ${title}, storing without embedding`);
                    }
                    
                    const newPaper = new paperModel({
                        title: title,
                        abstract: abstract,
                        difficultyLevel: 'Intermediate',
                        tags: ['CSV'],
                        content: abstract,
                        chunks: [{ text: abstract, embedding: embedding }]
                    });
                    
                    await newPaper.save();
                    count++;
                    if (count % 10 === 0) console.log(`  ...saved ${count}/${results.length} CSV papers`);
                }
                console.log(`✅ CSV Ingestion complete! Saved ${count} papers to Atlas.`);
                resolve({ count });
            })
            .on('error', reject);
    });
};

// 📐 Cosine Similarity Helper
export function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || !vecA.length || vecA.length !== vecB.length) return 0;
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// 🤖 PAPER-SCOPED AI TUTOR ANSWER GENERATION
import { GoogleGenAI } from '@google/genai';

export const answerPaperQuestion = async (paper, prompt) => {
    let relevantContext = "";

    // 1. Extract context from paper chunks or abstract/content
    if (paper.chunks && paper.chunks.length > 0) {
        try {
            // Try to get query embedding from local Ollama
            const queryEmbedding = await getLocalEmbedding(prompt);
            
            // Calculate similarity score for each chunk
            const scoredChunks = paper.chunks.map(chunk => {
                const score = (chunk.embedding && chunk.embedding.length) 
                    ? cosineSimilarity(queryEmbedding, chunk.embedding) 
                    : 0;
                return { text: chunk.text, score };
            });

            // Sort by score descending and pick top 3
            scoredChunks.sort((a, b) => b.score - a.score);
            const topChunks = scoredChunks.slice(0, 3).map(c => c.text).filter(Boolean);

            if (topChunks.length > 0) {
                relevantContext = topChunks.join("\n\n---\n\n");
            }
        } catch (err) {
            console.log("Local embedding for query failed, using paper content/chunks directly:", err.message);
        }
    }

    if (!relevantContext) {
        const textSources = [];
        if (paper.abstract) textSources.push(`Abstract: ${paper.abstract}`);
        if (paper.content) textSources.push(`Content: ${paper.content.substring(0, 3000)}`);
        if (paper.chunks && paper.chunks.length > 0) {
            const chunkTexts = paper.chunks.slice(0, 3).map(c => c.text).filter(Boolean);
            if (chunkTexts.length) textSources.push(`Excerpts:\n${chunkTexts.join("\n\n")}`);
        }
        relevantContext = textSources.join("\n\n");
    }

    if (!relevantContext) {
        relevantContext = `Title: ${paper.title}\nAbstract: ${paper.abstract || 'No detailed content available.'}`;
    }

    const systemPrompt = `You are PaperPath AI Tutor, an intelligent and encouraging academic assistant.
Answer the user's question about the research paper titled "${paper.title}".
Rely on the provided context below. Explain concepts simply and clearly.

CONTEXT:
${relevantContext}

USER QUESTION:
${prompt}

Provide a helpful, well-structured response using Markdown formatting.`;

    // 2. Try Gemini API first (using GEMINI_API_KEY from .env)
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
        try {
            console.log(`🤖 Requesting response from Gemini API for paper "${paper.title}"...`);
            const llm = new GoogleGenAI({ apiKey });
            const response = await llm.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: systemPrompt,
            });

            if (response && response.text) {
                return response.text;
            }
        } catch (geminiError) {
            console.error("⚠️ Gemini API generation failed, trying local Ollama fallback...", geminiError.message);
        }
    }

    // 3. Fallback to Local Ollama Generation
    try {
        console.log(`🤖 Requesting response from local Ollama model qwen2.5:0.5b...`);
        const ollamaRes = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'qwen2.5:0.5b',
                prompt: systemPrompt,
                stream: false
            })
        });

        if (ollamaRes.ok) {
            const data = await ollamaRes.json();
            if (data.response) return data.response;
        }
    } catch (ollamaErr) {
        console.error("⚠️ Local Ollama generation also failed:", ollamaErr.message);
    }

    // 4. Final safety fallback
    return `Based on the paper "${paper.title}":\n\n${paper.abstract || 'No abstract available.'}\n\n*Note: Could not reach AI models for detailed question answering.*`;
};