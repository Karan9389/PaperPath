import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import authRouters from './src/routes/authRouters.js';
import userRouters from './src/routes/userRoutes.js';


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

//api redirect to authentication routes
app.use('/api/auth', authRouters);

//api redirect to paper routes
app.use('/api/papers', paperRoutes);

//api redirect to user routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) =>{
    res.send('API is running');
});
const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})
