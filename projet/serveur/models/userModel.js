const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: true,
            minLength:2,
        },
        prenom: {
            type: String,
            required: true,
            minLength:2,
        },
        pseudo: {
            type: String,
            required: true,
            minLength:3,
            maxLength:30,
            unique:true,
        },
        password: {
            type: String,
            required: true,
            minLength:3,
            maxLength:30,
        },
        profileImage: {
            type: Boolean,
            default :false 

        },
        bio: {
            type: String,
            required: false,
            minLength:1,
            maxLength: 100,
            default: "I love SpreadApp ! "
        },
        Myfollowers: {
            type: [String]
        },
        Myfollowings: {
            type: [String]
        },
        Myfriends: {
            type: [String]
        },
        isConnected: {
            type: Boolean,
            default:false
        },
        createdAt: {
            type: Date,
            default: Date.now
          }
        });

          
module.exports = mongoose.model('User', userSchema); 