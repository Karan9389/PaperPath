import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import authRouters from './src/routes/authRouters.js';
<<<<<<< HEAD
import userRouters from './src/routes/userRoutes.js';
import aiRoute from './src/routes/aiRoutes.js'
// import paperRoutes from './src/routes/'


=======
import userRoutes from './src/routes/userRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
>>>>>>> a1ef04e21e4fab27b8c4c504f13c0a1425beea54

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// api redirect to authentication routes
app.use('/api/auth', authRouters);

<<<<<<< HEAD
//api redirect to user routes
app.use('/api/users', userRouters);

//api redirect to gemini api services
app.use('/api/ai', aiRoute);
=======
// api redirect to user routes
app.use('/api/users', userRoutes);

// api redirect to gemini api services
app.use('/api/ai', aiRoutes);
>>>>>>> a1ef04e21e4fab27b8c4c504f13c0a1425beea54

app.get('/', (req, res) =>{
    res.send('API is running');
});
const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})
