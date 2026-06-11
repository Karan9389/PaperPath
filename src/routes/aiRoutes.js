import express from 'express';
import { testGeminiConnection } from '../controllers/aiController.js';

// router that will direct the request to the gemini function present in controllers that is powered by the imported function in aiServices.js

const router = express.Router();
router.post('/test', testGeminiConnection);

export default router;