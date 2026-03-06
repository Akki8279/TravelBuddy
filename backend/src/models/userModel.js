const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        index : true
    },
    password:{
        type:String,
        required:true,
        select:false
    },

    //for profile
    avatar:{
        type:String
    },
    bio:{
        type:String
    },

    //ratings and reviews
    ratings :{
        type:Number,
        default:0
    },
    totalReviews:{
        type:Number,
        default:0
    },

    isVerified: {
        type: Boolean,
        default: false 
    },
    isBlocked: {
        type: Boolean,
        default: false 
    }  

},{ timestamps: true })

module.exports = mongoose.model('User',userSchema);