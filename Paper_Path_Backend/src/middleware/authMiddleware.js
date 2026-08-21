import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user.js';

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'paperpath-secret');
            const userId = decoded?.id;
            const isObjectId = userId && mongoose.Types.ObjectId.isValid(userId);

            let user = null;
            if (isObjectId) {
                user = await User.findById(userId).select('-password');
            }

            if (!user) {
                if (decoded?.id && !isObjectId) {
                    req.user = {
                        _id: decoded.id,
                        name: decoded.name || 'Demo User',
                        email: decoded.email || null,
                        role: decoded.role || 'user'
                    };
                    return next();
                }

                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user;
            return next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired, please log in again' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            }
            // Unexpected error — log the full details
            console.error('[authMiddleware] Unexpected error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    return res.status(401).json({ message: 'Not authorized, no token' });
};

export { protect };