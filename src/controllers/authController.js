import User from '../models/user.js';
import jwt from 'jsonwebtoken';

//Helper function to generate JSON WEB TOKEN.
const generateToken = (id) => {
    //this method use the jwt key and expire with in 30 days.
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //check if the user already exist with the email or not.
        const userExist = User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: 'User already exist ' });
        }
        //if not exist then create a new user.
        const user = await User.create({
            name,
            email,
            password
        });
        //if successful return user + token.
        if(user){
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        }else{
            res.status(400).json({message : "Invalid user Details"});
        }
    }catch(error){
        res.status(500).json({message : error.message});
    }
};

const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = User.findOne({email}).select('+password');
        //check if user exist and password match
        if(user && user.matchPassword(password)){
            res.json({
                _id : user._id,
                name: user.name,
                email : user.email,
                token : generateToken(user._id)
            })
        }else{
            res.status(500).json({message : "Invalid email or password"});
        }
        
    }catch(error){
        res.status.json({message : error.message});
    }
}

const getUserProfile = async (req, res) => {
    const user = {
        _id : req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
    }
    res.json(user);
};


export { registerUser, loginUser, getUserProfile };