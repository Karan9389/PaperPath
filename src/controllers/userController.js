import User from '../models/User.js';

// @desc    Toggle saving/unsaving a paper
// @route   POST /api/users/save/:paperId
// @access  Private
const toggleSavePaper = async (req, res) => {
  //i will write logic later ok aditya
};

// @desc    Add a paper to reading history
// @route   POST /api/users/history/:paperId
// @access  Private
const addPaperToHistory = async (req, res) => {
    //i will write logic later ok aditya
};

// @desc    Get the user's dashboard data (saved papers & history)
// @route   GET /api/users/library
// @access  Private
const getUserLibrary = async (req, res) => {
    //i will write logic later ok aditya
};

export { toggleSavePaper, addPaperToHistory, getUserLibrary };