// models/userProgress.js
import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    paperId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'paper',
        required: true
    },
    status: {
        type: String,
        enum: ['discovered', 'reading', 'completed'],
        default: 'discovered'
    },
    notes: {
        type: String, // Allows students to keep brief scratchpad notes on their progress page
        default: ""
    }
}, { timestamps: true });

// Ensures a unique progress entry per paper for every user
userProgressSchema.index({ userId: 1, paperId: 1 }, { unique: true });

const userProgressModel = mongoose.models.userProgress || mongoose.model('userProgress', userProgressSchema);
export default userProgressModel;