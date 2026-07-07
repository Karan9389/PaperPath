import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processCsvStream, processPdfAndIngest } from '../services/geminiServices.js';
import paperModel from '../models/paper.js';

const router = express.Router();
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 500 * 1024 * 1024 } 
});

// --- REAL MONGODB GET ROUTES ---
router.get('/', async (req, res) => {
    try {
        // Fetch the newest 50 papers from MongoDB, excluding the heavy vector embeddings
        const papers = await paperModel.find({}, '-chunks').sort({ createdAt: -1 }).limit(50);
        res.json({ data: papers });
    } catch (error) {
        console.error("❌ Error fetching papers:", error);
        res.status(500).json({ message: "Failed to load papers." });
    }
});

router.get('/:paperId', async (req, res) => {
    try {
        const paper = await paperModel.findById(req.params.paperId, '-chunks');
        if (!paper) return res.status(404).json({ message: 'Paper not found' });
        res.json({ data: paper });
    } catch (error) {
        console.error("❌ Error fetching paper details:", error);
        res.status(500).json({ message: "Failed to load paper details." });
    }
});

// 🤖 LOCAL OLLAMA CHAT ROUTE
router.post('/:paperId/ask', async (req, res) => {
    try {
        const { prompt } = req.body;
        const { paperId } = req.params;

        if (!prompt) return res.status(400).json({ message: 'Please provide a prompt.' });

        console.log(`🤖 User asked: "${prompt}" about paper: ${paperId}`);

        const embedResponse = await fetch('http://localhost:11434/api/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'nomic-embed-text', prompt: prompt })
        });
        const { embedding } = await embedResponse.json();

        const searchResults = await paperModel.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_index", 
                    "path": "chunks.embedding",
                    "queryVector": embedding,
                    "numCandidates": 50,
                    "limit": 3
                }
            }
        ]);

        let contextText = "";
        if (searchResults.length > 0 && searchResults[0].chunks) {
            contextText = searchResults[0].chunks.slice(0, 3).map(c => c.text).join("\n\n");
        } else {
            const fallbackPaper = await paperModel.findById(paperId).catch(() => null);
            contextText = fallbackPaper ? fallbackPaper.abstract : "No context available.";
        }

        const aiResponse = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'qwen2.5:0.5b',
                prompt: `You are an AI tutor helping a student understand an academic paper. Read the following excerpts and answer the user's question simply and clearly.\n\nExcerpts:\n${contextText}\n\nUser Question: ${prompt}`,
                stream: false
            })
        });
        
        const finalData = await aiResponse.json();
        return res.json({ data: finalData.response });

    } catch (error) {
        console.error('❌ Local Chat Route failed:', error);
        return res.status(500).json({ message: "Failed to generate AI response." });
    }
});

// 🔀 SMART UPLOAD ROUTE
router.post('/upload', upload.single('dataset'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "Please upload a file using the form field 'dataset'." });

        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        console.log(`📥 Smart Router: Received a ${fileExtension} file`);

        if (fileExtension === '.csv') {
            const result = await processCsvStream(req.file.path);
            return res.status(201).json({ success: true, message: `Streaming ingestion completed! Processed ${result.count} rows.` });
        }

        if (fileExtension === '.pdf') {
            const pdfBuffer = fs.readFileSync(req.file.path);
            const cleanTitle = req.file.originalname.replace('.pdf', '');
            const paper = await processPdfAndIngest(pdfBuffer, cleanTitle);
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(201).json({ success: true, message: `Saved "${cleanTitle}" to Atlas!` });
        }

        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(400).json({ success: false, message: "Unsupported file format." });

    } catch (error) {
        console.error("❌ Smart Upload Route Failure:", error);
        return res.status(500).json({ success: false, message: "Ingestion failed", error: error.message });
    }
});

export default router;