let User = require('../models/userModel');
let Comment = require('../models/commentModel');
let Post = require('../models/postModel');
let Notification = require('../models/notificationModel');

module.exports.postPost = async (req, res, next) => {
    let { id } = req.params;
    let { text, author, img } = req.body;
    let poster = await User.findById(author);
    let newPost = await new Post({
        text,
        author,
        postDate: Date()
    });
    if (req.files) {
        for (let file of req.files) {
            newPost.img.push({filename: file.filename, path: file.path})
        }
    }
    await newPost.save().then(data => { console.log(data); return data }).catch(err => console.log(err));
    poster.posts.push(newPost.id);
    await poster.save()
        .then(data => console.log(data))
        .catch(err => console.log(err));
res.redirect('/user')
};

module.exports.userLike = async (req, res, next) => {
    let  user_id  = req.params.id;
    let { post_id } = req.body;
    let currentUser = await User.findById(user_id );
    let likedPost = await Post.findById(post_id);
    if (likedPost.likes.indexOf(user_id) === -1) {
        likedPost.likes.push(user_id);
        await likedPost.save()
            .then(data => { console.log(data); return data })
            .catch(err => console.log(err))
    } else {
        likedPost.likes.pull({ _id: user_id })
        await likedPost.save()
            .then(data => { console.log(data.likes); return data })
            .catch(err => console.log(err));
    }
};

module.exports.editPost = async (req, res, next) => {
    let { post_id } = req.params;
    let newText  = req.body.text;
    let currentPost = await Post.findByIdAndUpdate(post_id, { text: newText })
        .then(data => { console.log(data); return data })
        .catch(err => console.log(err));
    console.log('editPostWORKING');
};

module.exports.deletePost = async (req, res, next) => {
    let { post_id } = req.params;
    let postToDelete = await Post.findByIdAndDelete(post_id)
        .then(data => { console.log(data); return data })
        .catch(err => console.log(err));
    let postAuthor = await User.findById(postToDelete.author);
    console.log('BEFORE ' + postAuthor.posts.length);
    postAuthor.posts.pull(post_id);
    await postAuthor.save();
    console.log('AFTER ' + postAuthor.posts.length);
    let allComments = await postToDelete.populate({ path: 'comments' });
    let { comments } = allComments;
    for (let comment of comments) {
        let deletedComment = await Comment.findByIdAndDelete(comment.id);
        let commentAuthor = await User.findById(comment.author);
        console.log('BEFORE ' + commentAuthor.comments.length);
        commentAuthor.comments.pull(comment.id);
        await commentAuthor.save();
        console.log('After ' + commentAuthor.comments.length);

    };
    console.log('deletePostWORKING');
};


