import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protect = async (req, res, next) => {
    let token;

    // 1. Finding the token in the request
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extracting the token
            token = req.headers.authorization.split(' ')[1];

            //3. Verifying the Token
            const decoded = jwt.verify(token, process.env.User.JWT_SECRET);
            //4. Moe on to the next acutal contoller funition
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export { protect };