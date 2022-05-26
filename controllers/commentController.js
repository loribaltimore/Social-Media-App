let User = require('../models/userModel');
let Comment = require('../models/commentModel');
let Post = require('../models/postModel');
let Notification = require('../models/notificationModel');

module.exports.addComment = async (req, res, next) => {
    let { id, post_id} = req.params;
    let { body, author } = req.body;
    let newComment = await new Comment({ author, body, post_id })
        .save()
        .then(data => { return data })
        .catch(err => console.log(err));
    let currentUser = await User.findById(id);
    console.log(currentUser.comments.length+ ' BEFORE')
    currentUser.comments.push(newComment.id);
    await currentUser.save()
        .then(data => {return data})
        .catch(err => console.log(err));
    console.log(currentUser.comments.length+ ' AFTER')
    let currentPost = await Post.findById(post_id);
    let postAuthor = await User.findById(currentPost.author);
    currentPost.comments.push(newComment.id);
    let newNotify = await new Notification({
        toId: currentPost.author,
        toName: `${postAuthor.bio.first_name} ${postAuthor.bio.last_name}`,
        fromId: currentUser.id,
        fromName: `${currentUser.bio.first_name} ${currentUser.bio.last_name}`,
        category: 'Comment',
        message: `${currentUser.bio.first_name} ${currentUser.bio.last_name} commented on your post!`,
        sent: Date()
    }).save();
    postAuthor.notifications.push(newNotify.id);
    await postAuthor.save();
    await currentPost.save().then(data => console.log(data)).catch(err => console.log(err));
}

module.exports.likeComment = async (req, res, next) => {
    let { comment_id, id } = req.params;
    let likedComment = await Comment.findById(comment_id);
    likedComment.likes.push(id);
    await likedComment.save()
    console.log('working likes')
};

module.exports.deleteComment = async (req, res, next) => {
    let { comment_id, post_id, id } = req.params;
    console.log(req.params);
    let commentToDelete = await Comment.findByIdAndDelete(comment_id);
    let currentUser = await User.findById(id);
    console.log('BEFORE ' + currentUser.comments.length)
    currentUser.comments.pull(comment_id);
    console.log('AFTER ' + currentUser.comments.length)
    await currentUser.save();
    let currentPost = await Post.findById(post_id);
    console.log('BEFORE ' + currentPost.comments.length);
    currentPost.comments.pull(comment_id);
    console.log('AFTER ' + currentPost.comments.length);
    await currentPost.save();
    console.log('no ISSUES WITH COMMENT DELETE')
}

module.exports.editComment = async (req, res, next) => {
    let newCommentBody = req.body.body;
    let { comment_id, post_id, id } = req.params;
    let currentComment = await Comment.findByIdAndUpdate(comment_id, { body: newCommentBody })
        .then(data => { console.log(data); return data })
        .catch(err => console.log(data));
console.log('COMMENT EDIT WORKING')
}