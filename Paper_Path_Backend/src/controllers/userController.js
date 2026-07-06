import User from '../models/user.js';

// @desc    Toggle saving/unsaving a paper
// @route   POST /api/users/save/:paperId
// @access  Private
const toggleSavePaper = async (req, res) =>{
    try{
        const user = await User.findById(req.user._id);
        //extracting peper id from the api request papameters 
        const paperId = req.params.paperId;

        const isSaved = user.savedPapers.includes(paperId);

        if (isSaved) {
            //Unsave it (remove from array)
            user.savedPapers = user.savedPapers.filter(id => id.toString() !== paperId);
        }else{
            //save it (add to array)
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

        //Remove it if it's already in history so we can move it to the top with a new data
        user.readHistory = user.readHistory.filter(item => item.paper.UsertoString() !== paperId);

        //add to the beginning of the array
        user.readHistory.unshift({paper : paperId, readAt: Date.now()});
        await user.save();
        res.json({ readHistory: user.readHistory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

// @desc    Get the user's dashboard data (saved papers & history)
// @route   GET /api/users/library
// @access  Private
const getUserLibrary = async (req, res) => {
    try{
        //instead of returning the id of peper it returen and populate the liberary of user with paper object
        const user = req.User.findById(req.usr._id)
            .populate('savedPapers', 'title difficulty Level')
            .populate('readHistory', 'title difficultyLevel');
        if(!user){
            return res.status(404).json({message : 'user not found'});
        }
        res.json({
            savedPapers : user.savedPapers,
            readHistory : user.readHistory
        });
    }catch(error){
        res.status(500).json({messaage : error.messaage});
    }
};

export { toggleSavePaper, addPaperToHistory, getUserLibrary };