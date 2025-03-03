const mongoose = require("mongoose");

const ProfilePicSchema = new mongoose.Schema(
    {
        user: { 
            type: String,
            required: true,
            unique: true
        },

        picture: {
            type: Number,
            required: true, 
        }
    },
);

module.exports = mongoose.model('pics', ProfilePicSchema);