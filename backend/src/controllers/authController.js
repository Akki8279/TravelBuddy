const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "5d"
    });
};

async function register(req,res){
    try {
        const {name, email, password} = req.body;
    
        if(!name || !email || !password){
            return res.status(400).json({message: "Please provide all credentials"});
        }
    
        const newUser = await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
        });
        
        const token = signToken(newUser._id);
    
        res.status(201).json({
            success: true,
            token,
            data: newUser
        });
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
}

async function login(req,res){
    try {
        const {email, password} = req.body;
    
        if(!email || !password){
            return res.status(400).json({message: "Please provide all credentials"});
        }
        const user = await User.findOne({email}).select("+password");
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = signToken(user._id);
        res.json({
            success: true,
            token,
            data: user,
          });

    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
}

async function getProfile(req,res){
    res.json({
        success: true,
        data: req.user,
      });
}

module.exports = {
    register,
    login,
    getProfile
}