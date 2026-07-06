import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true
    },
    verifyOtp: { 
        type: String, // String handles leading zeros safely (e.g., "012345")
        default: null 
    },
    verifyOtpExpireAt: { 
        type: Number, 
        default: 0 
    },
    isAccountVerified: { 
        type: Boolean, 
        default: false 
    },
    resetOtp: { 
        type: String, 
        default: null 
    },
    resetOtpExpireAt: { 
        type: Number, 
        default: 0 
    },
    targetLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'], // Keeps your data clean
        default: 'beginner' // Safe default for your specific MVP requirements
    },
    savedPapers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paper'
    }],
    readHistory: [{
        paper: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Paper'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true }); // Automatically creates createdAt and updatedAt fields

userSchema.methods.matchPassword = async function (enteredPassword) {
    return this.password === enteredPassword;
};

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;