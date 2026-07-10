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
const envPath = path.resolve(process.cwd(), '.env');
const fallbackEnvPath = path.resolve(process.cwd(), '../.env');
const envResult = dotenv.config({ path: envPath });

if (envResult.error) {
    dotenv.config({ path: fallbackEnvPath });
}

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

// Example of the correct async startup pattern
const startServer = async () => {
    try {
        // 1. Wait for the database to connect FIRST
        await connectDB(); 
        
        // 2. THEN start the server
        app.listen(3001, () => {
            console.log('Server is running on port 3001');
        });
    } catch (error) {
        console.error('Failed to connect to the database', error);
    }
};

startServer();