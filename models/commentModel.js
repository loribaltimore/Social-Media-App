let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let model = mongoose.model;
let User = require('./userModel');
let Post = require('./postModel')

let commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    body: {
        type: String,
        required: true,
        maxlength: 150,
        minlength: 1
    },
    flair: {
        type: String,
        enum: ['Huh?', 'No Way!', 'Amazing!', 'Okay..']
    },
    likes: [
        {
        type: Schema.Types.ObjectId,
        ref: 'User'
        }
    ],
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }
});

let Comment = model('comment', commentSchema);

module.exports = Comment;