// src/services/geminiServices.js
import { GoogleGenAI } from '@google/genai';
import { createRequire } from 'module';
import fs from 'fs'; 
import csv from 'csv-parser';
import paperModel from '../models/paper.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const getLlmInstance = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY inside your environment configurations (.env).");
    }
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const chunkText = (text, maxLength = 1000, overlap = 200) => {
    const chunks = [];
    let i = 0;
    while (i < text.length) {
        chunks.push(text.substring(i, i + maxLength));
        i += (maxLength - overlap);
    }
    return chunks;
};

// 🔥 ENGINE 1: PDF PROCESSING & CHUNKING
export const processPdfAndIngest = async (pdfBuffer, documentTitle) => {
    let rawText = "";
    try {
        const parsedData = await pdfParse(pdfBuffer);
        rawText = parsedData.text;
    } catch (e) {
        rawText = pdfBuffer.toString('utf-8');
    }

    const textChunks = chunkText(rawText);
    const formattedChunks = [];
    const llm = getLlmInstance();

    console.log(`🤖 Processing ${textChunks.length} chunks via gemini-embedding-2...`);

    for (let index = 0; index < textChunks.length; index++) {
        const chunkTextContent = textChunks[index];
        
        const result = await llm.models.embedContent({
            model: "gemini-embedding-2", 
            contents: chunkTextContent,
            config: {
                outputDimensionality: 768
            }
        });

        // 🎯 THE ACTUAL FIX: Accessing the plural array correctly 
        formattedChunks.push({
            chunkId: `chunk_${index}`,
            text: chunkTextContent,
            embedding: result.embeddings[0].values
        });
    }

    return await paperModel.create({
        title: documentTitle,
        difficulty: 'beginner',
        chunks: formattedChunks
    });
};

// 🔥 ENGINE 2: CSV ROW-BY-ROW STREAMING
export const processCsvStream = async (filePath) => {
    return new Promise((resolve, reject) => {
        let processedCount = 0;
        const TARGET_ROWS_LIMIT = 5; 
        const llm = getLlmInstance();
        const stream = fs.createReadStream(filePath).pipe(csv());

        stream.on('data', async (row) => {
            try {
                stream.pause();
                if (processedCount >= TARGET_ROWS_LIMIT) {
                    stream.destroy();
                    return;
                }

                const title = row.title || "Untitled Paper";
                const abstract = row.abstract || "";
                const authors = row.authors || "Unknown Author";

                if (abstract && abstract.trim().length > 0) {
                    const textToEmbed = `Title: ${title}. Authors: ${authors}. Abstract: ${abstract}.`;
                    
                    const result = await llm.models.embedContent({
                        model: "gemini-embedding-2",
                        contents: textToEmbed,
                        config: {
                            outputDimensionality: 768
                        }
                    });

                    // 🎯 THE ACTUAL FIX: Accessing the plural array correctly here as well
                    await paperModel.create({
                        title,
                        authors,
                        abstract,
                        difficulty: 'beginner',
                        embedding: result.embeddings[0].values
                    });

                    processedCount++;
                    console.log(`✅ Smart Ingested [CSV Row ${processedCount}]: ${title.substring(0, 20)}...`);
                }
                stream.resume();
            } catch (err) {
                stream.destroy();
                reject(err);
            }
        });

        stream.on('close', () => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            resolve({ success: true, count: processedCount });
        });

        stream.on('error', (err) => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            reject(err);
        });
    });
};