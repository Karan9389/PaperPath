import express from 'express';
import { toggleSavePaper, addPaperToHistory, getUserLibrary } from '../controllers/userController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();
router.get('/library', protect, getUserLibrary);
router.post('/save/:paperId', protect, toggleSavePaper);
router.post('/history/:paperId', protect, addPaperToHistory);

export default router;