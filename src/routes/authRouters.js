import express from 'express';
import {registerUser, loginUser} from '../controllers/authController.js';

const router = express.Router();

//divert the requests to the controller functions as per the api endpoints.✌️
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;