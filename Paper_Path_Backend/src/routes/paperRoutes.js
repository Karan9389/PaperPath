// src/routes/paperRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs'; 
import { processCsvStream, processPdfAndIngest } from '../services/geminiServices.js';

const router = express.Router();

// Save files temporarily to disk inside the 'uploads' folder
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 500 * 1024 * 1024 } // 500MB payload max capacity
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