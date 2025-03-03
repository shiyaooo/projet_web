const mongoose = require("mongoose");


const postSchema = new mongoose.Schema(
    {

        user: {  
            type: String,
            required: true
        },

        contenu: {
            type: String,
        },
        image: {
            type: String,
        },

        date: {
            type: Date,
            default: Date.now
        },
        likes: {
            type:[String],
        },
        commentaires: {
            type: [String]
        }
    }
);

module.exports = mongoose.model('Post', postSchema);