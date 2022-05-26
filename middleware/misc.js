let User = require('../models/userModel');
let Post = require('../models/postModel');
let Comment = require('../models/commentModel');
let Notification = require('../models/notificationModel');


module.exports.locals = (req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.activeUser = req.user;
    res.locals.notifications = undefined;
    next();
};



module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', 'You must be logged in to do that')
        res.redirect('/user/login');
    }
};

module.exports.isAuthUser = async(req, res, next) => {
    let { id } = req.params;
    if (id === req.user.id) {
        next()
    }
};

module.exports.isAuthComment = async(req, res, next) => {
    let { comment_id } = req.params;
    let currentComment = await Comment.findById(comment_id);
    let author = await User.findById(currentComment.author);
    if (author.id === req.user.id) {
        console.log('itsworkingbud')
        next();
    }
};

module.exports.isAuthPost = async(req, res, next) => {
    let { post_id } = req.params;
    console.log()
    let currentPost = await Post.findById(post_id);
    let author = await User.findById(currentPost.author);
    if (author.id === req.user.id) {
        next()
    };
};

////protecting my routes now


