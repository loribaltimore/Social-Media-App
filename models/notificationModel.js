let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let model = mongoose.model;
let User = require('./userModel');
let Post = require('./postModel');
let Comment = require('./commentModel');

let notificationSchema = new Schema({
    toId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toName: {
        type: String,
        required: true
    },
    fromId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fromName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Post', 'Comment', 'User'],
        required: true
    },
    sent: {
        type: Date,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

let Notification = model('notification', notificationSchema);
module.exports = Notification;