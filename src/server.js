import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.congig();
connectDB();

const app = express();
app.use(cors);
app.use(ecpress.json());

app.use('/api/auth', authRouters)
app.get('/', (req, res) =>{
    res.send('API is running');
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})
