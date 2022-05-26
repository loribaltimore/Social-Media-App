let mongoose = require('mongoose');
const passport = require('passport');
let Schema = mongoose.Schema;
let model = mongoose.model;
let passportLocalMongoose = require('passport-local-mongoose');
let Post = require('./postModel');
let Comment = require('./commentModel')
let Notification = require('./notificationModel');

let userSchema = new Schema({
    email: {
        type: String,
        require: true,
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: Post
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }   
    ],
    likedPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    likedComments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    friends: [
        {
            type: mongoose.Types.ObjectId,
            required: true
        }
    ],
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
    friend_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    bio: {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        location: {
            type: String
        },
        from: {
            type: String
        },
        relationship_status: {
            type: String,
            enum: ['Single', 'Partnered', 'It\'s Complicated']
        },
        member_since: {
            type: Date,
            required: true
        },
        blurb: {
            type: String,
        }
    },
    notifications: [
        {
            type: Schema.Types.ObjectId,
            ref: Notification
        }
    ],
    profile_pictures: {
        profile: {
            path: {
                type: String,
             
            },
            filename: {
                type: String,
              
            }
        },
        cover: {
            path: {
                type: String,
              
            },
            filename: {
                type: String,
                
            }
        }
}
});

userSchema.virtual('fullName').get(function () {
    return `${this.bio.first_name} ${this.bio.last_name}`
});
userSchema.plugin(passportLocalMongoose);
let User = model('user', userSchema);

module.exports = User;



////Im thinking of ways to reference friends using independently generated Ids so I don't have to us populate
//// Can we generate Object Ids within a model that already has an Object Id so we can reference it later?
////try to push posts into users. may have to delete users and create some with friend_ids (new model)