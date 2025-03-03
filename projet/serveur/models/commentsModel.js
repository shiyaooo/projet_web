const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        user: { 
            type: String,
        },

        message: {
            type: String,
            required: true, 
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
);

module.exports = mongoose.model('comments', CommentSchema);