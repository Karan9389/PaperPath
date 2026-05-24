import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import authRouters from './src/routes/authRouters.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouters);

app.get('/', (req, res) =>{
    res.send('API is running');
});
const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})
