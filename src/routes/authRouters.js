import express from 'express';
<<<<<<< HEAD
import {registerUser, loginUser, getUserProfile} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
=======
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authmiddleware.js';
>>>>>>> a1ef04e21e4fab27b8c4c504f13c0a1425beea54

const router = express.Router();

//divert the requests to the controller functions as per the api endpoints.✌️
router.post('/register', registerUser);
router.post('/login', loginUser);

//Private route (Middleware protect profile route)
router.get('/profile',protect, getUserProfile);
export default router;