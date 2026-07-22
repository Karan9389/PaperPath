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
            .populate({ path: 'savedPapers', select: 'title difficultyLevel abstract tags' })
            .populate({ path: 'readHistory.paper', select: 'title difficultyLevel abstract tags' });

        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        const savedPapers = (user.savedPapers || []).map((paper) => ({
            _id: paper?._id,
            title: paper?.title,
            difficultyLevel: paper?.difficultyLevel || paper?.difficulty || 'Beginner',
            abstract: paper?.abstract,
            tags: paper?.tags || []
        }));

        const readHistory = (user.readHistory || [])
            .map((entry) => entry?.paper)
            .filter(Boolean)
            .map((paper) => ({
                _id: paper?._id,
                title: paper?.title,
                difficultyLevel: paper?.difficultyLevel || paper?.difficulty || 'Beginner',
                abstract: paper?.abstract,
                tags: paper?.tags || []
            }));

        return res.json({ savedPapers, readHistory });
    } catch (error) {
        console.error('❌ getUserLibrary failed:', error);
        return res.status(500).json({ message: error.message });
    }
};

export { toggleSavePaper, addPaperToHistory, getUserLibrary };