let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let model = mongoose.model;
let User = require('./userModel');
let Comment = require('./commentModel');

let postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    img: [
        {
            path: {
                type: String,
                required: true
            },
            filename: {
                type: String,
                required: true
            }
        }
    ],
    text: {
        type: String,
        maxlength: 250
    },
    postDate: {
        type: Date,
        required: true
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: Comment
        }
    ]
});

let Post = model('post', postSchema);

module.exports = Post;

///working on having the post authors name on the post, same with comments.
///may need to create referenceable IDs that aren't ref'd like friendID