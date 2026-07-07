// src/routes/paperRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
import { processCsvStream, processPdfAndIngest } from '../services/geminiServices.js';
import paperModel from '../models/paper.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const router = express.Router();

// --- DUMMY DATA FOR FRONTEND UI (From your teammate) ---
const fallbackPaperContent = 'This sample paper explains the basics of transformer models and how attention mechanisms help language models process information effectively.';

const getSeededPapers = () => {
    const uploadFiles = fs.existsSync(path.resolve(process.cwd(), 'uploads'))
        ? fs.readdirSync(path.resolve(process.cwd(), 'uploads')).filter((name) => name && !name.startsWith('.'))
        : [];

    const defaultPapers = [
        {
            _id: 'sample-paper-1',
            title: 'Attention Is All You Need',
            difficultyLevel: 'Advanced',
            abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks and attention mechanisms...',
            tags: ['AI', 'Transformers'],
            content: fallbackPaperContent,
        }
    ];

    const uploadedPaperEntries = uploadFiles.slice(0, 8).map((fileName, index) => ({
        _id: `uploaded-paper-${index + 1}`,
        title: `Uploaded Paper ${index + 1}`,
        difficultyLevel: index % 2 === 0 ? 'Intermediate' : 'Beginner',
        abstract: `Paper imported from the uploads folder. File: ${fileName}`,
        tags: ['Uploaded', 'Sample', 'Research'],
        content: `This entry is seeded from the uploaded file ${fileName} so it appears for all users by default.`,
    }));

    return [...defaultPapers, ...uploadedPaperEntries];
};

const getSamplePaperContent = async () => {
    const samplePdfPath = path.resolve(process.cwd(), 'PaperPath Project.pdf');
    if (!fs.existsSync(samplePdfPath)) return fallbackPaperContent;
    try {
        const data = await pdfParse(samplePdfPath);
        const extractedText = (data?.text || '').trim();
        return extractedText.length > 200 ? extractedText.slice(0, 4000) : fallbackPaperContent;
    } catch (error) {
        return fallbackPaperContent;
    }
};

const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 500 * 1024 * 1024 } 
});

// --- GET ROUTES ---
router.get('/', async (req, res) => {
    const sampleContent = await getSamplePaperContent();
    const seededPapers = getSeededPapers().map((paper) => ({
        ...paper,
        content: paper._id === 'sample-paper-1' ? sampleContent : paper.content,
    }));
    res.json({ data: seededPapers });
});

router.get('/:paperId', async (req, res) => {
    const sampleContent = await getSamplePaperContent();
    const paper = getSeededPapers().find((item) => item._id === req.params.paperId);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });
    res.json({ data: { ...paper, content: paper._id === 'sample-paper-1' ? sampleContent : paper.content } });
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