import User from '../models/User.js';

// @desc    Toggle saving/unsaving a paper
// @route   POST /api/users/save/:paperId
// @access  Private
const toggleSavePaper = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const paperId = req.params.paperId;

        // Check if the paper is already saved
        const isSaved = user.savedPapers.includes(paperId);

        if (isSaved) {
            // Unsave it (remove from array)
            user.savedPapers = user.savedPapers.filter(id => id.toString() !== paperId);
        } else {
            // Save it (add to array)
            user.savedPapers.push(paperId);
        }

        await user.save();
        res.json({ savedPapers: user.savedPapers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a paper to reading history
// @route   POST /api/users/history/:paperId
// @access  Private
const addPaperToHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const paperId = req.params.paperId;
        // Add to history (avoid duplicates)
        if (!user.history.includes(paperId)) {
            user.history.push(paperId);
            await user.save();
        }
        res.json({ history: user.history });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

// @desc    Get the user's dashboard data (saved papers & history)
// @route   GET /api/users/library
// @access  Private
const getUserLibrary = async (req, res) => {
    //i will write logic later ok aditya
};

export { toggleSavePaper, addPaperToHistory, getUserLibrary };