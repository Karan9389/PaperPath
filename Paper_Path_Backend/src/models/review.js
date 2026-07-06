// models/review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Connects directly to your user model
        required: true
    },
    paperId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'paper', // Connects directly to your paper model
        required: true
    },
    difficultyRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    clarityRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    usefulnessRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        trim: true,
        maxLength: 1000
    }
}, { timestamps: true });

// CRITICAL INDEX: Prevents a single user from spamming multiple reviews on the same paper
reviewSchema.index({ userId: 1, paperId: 1 }, { unique: true });

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema);
export default reviewModel;