import express from 'express';
import {registerUser, loginUser, getUserProfile} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

//divert the requests to the controller functions as per the api endpoints.
router.post('/register', registerUser);
router.post('/login', loginUser);

//Private route (Middleware protect profile route)
router.get('/profile',protect, getUserProfile);
export default router;