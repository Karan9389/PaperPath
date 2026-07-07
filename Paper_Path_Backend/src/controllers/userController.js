import User from '../models/user.js';

const toggleSavePaper = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const paperId = req.params.paperId;

        const isSaved = user.savedPapers.includes(paperId);

        if (isSaved) {
            user.savedPapers = user.savedPapers.filter((id) => id.toString() !== paperId);
        } else {
            user.savedPapers.push(paperId);
        }

        await user.save();
        return res.json({ savedPapers: user.savedPapers });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const addPaperToHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const paperId = req.params.paperId;

        user.readHistory = user.readHistory.filter((item) => item.paper?.toString() !== paperId);
        user.readHistory.unshift({ paper: paperId, readAt: Date.now() });
        await user.save();
        return res.json({ readHistory: user.readHistory });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUserLibrary = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('savedPapers', 'title difficultyLevel abstract tags')
            .populate('readHistory.paper', 'title difficultyLevel abstract tags');

        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        const savedPapers = user.savedPapers || [];
        const readHistory = (user.readHistory || []).map((entry) => entry.paper).filter(Boolean);

        return res.json({ savedPapers, readHistory });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { toggleSavePaper, addPaperToHistory, getUserLibrary };