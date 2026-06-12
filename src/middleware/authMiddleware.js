import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protect = async (req, res, next) => {
    let token;

    // 1. Finding the token in the request
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extracting the token
            token = req.headers.authorization.split(' ')[1];

<<<<<<< HEAD
            //3. Verifying the Token
            const decoded = jwt.verify(token, process.env.User.JWT_SECRET);
            //4. Moe on to the next acutal contoller funition
=======
            // 3. Verifying the token
            const decoded = jwt.verify(token, process.env.User.JWT_SECRET);

            // 4. Optionally attach the user to the request
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

>>>>>>> a1ef04e21e4fab27b8c4c504f13c0a1425beea54
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