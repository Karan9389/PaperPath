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
export const processPdfAndIngest = async (pdfBuffer, title) => {
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
        tags: ['PDF', 'Local'],
        content: cleanText,
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
                    
                    const embedding = await getLocalEmbedding(abstract);
                    
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