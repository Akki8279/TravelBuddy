const User = require("../models/userModel");

async function getAllUsers(req,res){
    try {
        const users = await User.find();
        res.json({success: true, data: users});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
}

async function getUserById(req,res){
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({success: false, message: "User not found"});
    }
    res.json({success: true, data: user});
}

async function updateMe(req,res){
    try {
        const updatedUser = await User.findByIdAndUpdate(
            // req.params.id,
            req.user._id,
            req.body,
            {new: true, runValidators: true}
        );
        if(!updatedUser){
            return res.status(404).json({success: false, message: "User not found"});
        }
        res.json({success: true, data: updatedUser});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateMe
};