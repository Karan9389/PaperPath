// src/routes/paperRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
import { GoogleGenAI } from '@google/genai';
import { processCsvStream, processPdfAndIngest } from '../services/geminiServices.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const router = express.Router();

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
            abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks and attention mechanisms, which have become the foundation for modern transformer architectures.',
            tags: ['AI', 'Transformers'],
            content: fallbackPaperContent,
        },
        {
            _id: 'sample-paper-2',
            title: 'Introduction to Photosynthesis',
            difficultyLevel: 'Beginner',
            abstract: 'Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy, forming the base of life on Earth.',
            tags: ['Biology', 'Foundations'],
            content: 'The paper explains the role of chlorophyll, light reactions, and the Calvin cycle.',
        },
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

const SAMPLE_PAPERS = getSeededPapers();

const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        throw new Error('Gemini API key is not configured.');
    }
    return new GoogleGenAI({ apiKey });
};

const buildFallbackAnswer = (paper, prompt) => {
    return `Based on the sample paper "${paper.title}", the main idea is that ${paper.content}. In short, ${prompt} can be answered by focusing on the paper's core explanation of ${paper.tags.join(', ')}.`;
};

const getSamplePaperContent = async () => {
    const samplePdfPath = path.resolve(process.cwd(), 'PaperPath Project.pdf');

    if (!fs.existsSync(samplePdfPath)) {
        return fallbackPaperContent;
    }

    try {
        const data = await pdfParse(samplePdfPath);
        const extractedText = (data?.text || '').trim();
        return extractedText.length > 200 ? extractedText.slice(0, 4000) : fallbackPaperContent;
    } catch (error) {
        console.warn('Could not read the sample PDF for chatbot context:', error.message);
        return fallbackPaperContent;
    }
};

// Save files temporarily to disk inside the 'uploads' folder
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 500 * 1024 * 1024 } // 500MB payload max capacity
});

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
    if (!paper) {
        return res.status(404).json({ message: 'Paper not found' });
    }

    res.json({ data: { ...paper, content: paper._id === 'sample-paper-1' ? sampleContent : paper.content } });
});

router.post('/:paperId/ask', async (req, res) => {
    try {
        const { prompt } = req.body;
        const paper = getSeededPapers().find((item) => item._id === req.params.paperId) || getSeededPapers()[0];

        if (!prompt) {
            return res.status(400).json({ message: 'Please provide a prompt.' });
        }

        const context = `You are helping a student understand the research paper titled "${paper.title}". Abstract: ${paper.abstract}. Paper content: ${paper.content}. User question: ${prompt}`;

        const llm = getGeminiClient();
        const response = await llm.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: context,
        });

        const answer = response?.text || response?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('') || buildFallbackAnswer(paper, prompt);
        return res.json({ data: answer });
    } catch (error) {
        console.error('Chat route failed:', error);
        const paper = SAMPLE_PAPERS.find((item) => item._id === req.params.paperId) || SAMPLE_PAPERS[0];
        return res.json({ data: buildFallbackAnswer(paper, req.body?.prompt || 'this topic') });
    }
});

// @desc    Smart unified upload for both CSV datasets and PDF research papers
// @route   POST /api/papers/upload
// @access  Public
router.post('/upload', upload.single('dataset'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a file using the form field 'dataset'." });
        }

        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        console.log(`📥 Smart Router: Received a ${fileExtension} file (${req.file.originalname})`);

        // 📊 CASE 1: The user uploaded a CSV dataset
        if (fileExtension === '.csv') {
            console.log("➡️ Routing to CSV Streaming Engine...");
            const result = await processCsvStream(req.file.path);
            
            return res.status(201).json({
                success: true,
                fileType: "CSV",
                message: `Streaming ingestion completed! Processed ${result.count} dataset rows straight into Atlas! 🚀`
            });
        }

        // 📄 CASE 2: The user uploaded a PDF research paper
        if (fileExtension === '.pdf') {
            console.log("➡️ Routing to PDF Chunking Engine...");
            
            // Read the temporary file from disk into a buffer
            const pdfBuffer = fs.readFileSync(req.file.path);
            
            const cleanTitle = req.file.originalname.replace('.pdf', '');
            const paper = await processPdfAndIngest(pdfBuffer, cleanTitle);

            // Clean up the temporary file from disk after processing
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

            return res.status(201).json({
                success: true,
                fileType: "PDF",
                message: `Successfully chunked and saved "${cleanTitle}" to MongoDB Atlas! 🚀`,
                chunksGenerated: paper.chunks?.length || 0
            });
        }

        // If format is unsupported, clear the temp file and reject
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        
        return res.status(400).json({ 
            success: false, 
            message: `Unsupported file format (${fileExtension}). Please upload a .pdf or .csv file.` 
        });

    } catch (error) {
        console.error("❌ Smart Upload Route Failure:", error);
        return res.status(500).json({ success: false, message: "Ingestion failed", error: error.message });
    }
});

export default router;