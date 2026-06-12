import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import authRouters from './src/routes/authRouters.js';
import userRouters from './src/routes/userRoutes.js';
import aiRoute from './src/routes/aiRoutes.js'
// import paperRoutes from './src/routes/'



dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

//api redirect to authentication routes
app.use('/api/auth', authRouters);

//api redirect to user routes
app.use('/api/users', userRouters);

//api redirect to gemini api services
app.use('/api/ai', aiRoute);

app.get('/', (req, res) =>{
    res.send('API is running');
});
const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})
