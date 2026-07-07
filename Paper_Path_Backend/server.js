import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import authRouters from './src/routes/authRouters.js';
import userRouters from './src/routes/userRoutes.js';
import aiRoute from './src/routes/aiRoutes.js'
import paperRouter from './src/routes/paperRoutes.js'; // 1. Import your new router layer
// import paperRoutes from './src/routes/'

const envPath = path.resolve(process.cwd(), '../.env');
dotenv.config({ path: envPath });
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// api redirect to authentication routes
app.use('/api/auth', authRouters);
app.use('/api/papers', paperRouter); // Everything handling papers now prefixes with /api/papers

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