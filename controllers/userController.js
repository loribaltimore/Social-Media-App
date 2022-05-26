const mongoose = require("mongoose");
const User = require("../models/userModel");
const Post = require("../models/postModel");
let Comment = require('../models/commentModel');
let Notification = require('../models/notificationModel');
let { AppError } = require('../middleware/errors');
let cloudinary = require('cloudinary').v2;

module.exports.userHome = async (req, res, next) => {
    let { id } = req.params;
    let currentUser = await User.findById(id);
    let allNotifications = await currentUser.populate({ path: 'notifications' });
    let { notifications } = allNotifications;
    let allFriendsPosts = [];
    let allAuthors = [];
    let commentAuthors = [];
    if (currentUser.friends.length > 1) {
        for (let i = 0; i <= currentUser.friends.length - 1; i++) {
            let friend = await User.findOne({ friend_id: currentUser.friends[i] });
            if (friend.posts.length > 0) {
                let friendPosts = await friend.populate({ path: 'posts', populate: { path: 'comments' } })
                    .then(data => { return data }).catch(err => console.log(err));
                for (let i = 0; i < friendPosts.posts.length; i++) {
                    allFriendsPosts.push(friendPosts.posts[i])
                }
            }
        };
        let newestPosts = allFriendsPosts.sort(function (a, b) {
            return b.postDate - a.postDate
        });
        for (let post of newestPosts) {
            let author = await User.findById(post.author)
                .then(data => { return data})
                .catch(err => console.log(err));
            let fullName = `${author.bio.first_name} ${author.bio.last_name}`;
            let info = { name: fullName, friendID: author.friend_id };
            if (author.profile_pictures.profile) {
                info.profile_picture = author.profile_pictures.profile.path
            };
            allAuthors.push(info);
        };
        let commentsByLikes = newestPosts.map(function (element, index) {
            return element.comments.sort(function (a, b) {
                return a.likes.length - b.likes.length
            });
        });
        for (let comment of commentsByLikes) {
            if (comment[0] !== undefined) {
                for (let el of comment) {
                    let author = await User.findById(el.author)
                    .then(data => {  return data })
                        .catch(err => console.log(err));
                    let commentInfo = {name:`${ author.bio.first_name } ${ author.bio.last_name }`, profile_picture: author.profile_pictures.profile.path }
                commentAuthors.push(commentInfo)
                }
            }
        };

        return res.render('index', {newestPosts, commentsByLikes, allAuthors, commentAuthors, notifications})
    }
    let newestPosts = undefined;
    let commentsByLikes = undefined;
    res.render('index', {newestPosts, commentsByLikes, commentAuthors, notifications})
};

module.exports.searchAllUsers = async (req, res, next) => {
    let { nav_search } = req.query;
    let { id } = req.params;
    nav_search = nav_search.replace(nav_search[0], nav_search[0].toUpperCase()).trim();
    let regex = new RegExp(`${nav_search}`);
    let searchResults = await User.find({ 'bio.first_name': regex });
    if (searchResults.length) {
        res.render('searchUsersShowPage', {searchResults})
    } else {
        let searchResults = await User.find({ 'bio.last_name': regex });
        if (searchResults.length) {
            res.render('searchUsersShowPage', {searchResults})
        } else {
            req.flash('error', 'Please Search by First and Last Name');
            res.redirect(`/user/${id}`)  
        }
    }

};

module.exports.renderLogin = (req, res, next) => {
    res.render('login')
};

module.exports.userLogin = async (req, res, next) => {
    let { id } = req.user;
    req.flash('success', `Welcome back ${req.user.bio.first_name}`)
    res.redirect(`/user/${id}`)
}

module.exports.userSignup = async (req, res, next) => {
    let { email, username, password, first_name, last_name,
        location, from, relationship_status, blurb } = req.body;
    let member_since = Date();
    let newUser = await new User({
        email,
        username,
        friend_id: mongoose.Types.ObjectId(),
        bio: {
            first_name, last_name, location, from,
            relationship_status, member_since, blurb
        }
    });
    if (req.files.length) {
        req.files.forEach((x) => {
            newUser.img.push({ path: x.path, filename: x.filename })
        })
    };
    newUser.friends.push(newUser.friend_id);
    let userToLogin = await User.register(newUser, password);
    await newUser.save()
        .then(data => { console.log(data); return data })
        .catch(err => console.log(err));
        req.login(userToLogin, function(err) {
            if (err) { return next(err); }
            return res.redirect(`/user/${newUser.id}`);
        });
};
module.exports.userLogout = (req, res, next) => {
    req.logout();
    req.flash('success', 'Successfully Logged Out!');
    res.redirect('/user/login');
}

module.exports.renderSignUp = (req, res, next) => {
    res.render('signup');
}

module.exports.renderDeletePage = (req, res, next) => {
res.render('deleteConfirm')
}

module.exports.deleteProfile = async (req, res, next) => {
    let { id } = req.params;
    let currentUser = await User.findByIdAndDelete(id);
    res.redirect('/user/login')
}


module.exports.editUser = async (req, res, next) => {
    console.log('wealllovejizz')
    let { id } = req.params;
    let currentUser = await User.findById(id);
    //Set Profile Pictures
    if (req.body.profile_picture) {
        let profilePicture = req.body.profile_picture;
        let currentUser = await User.findByIdAndUpdate(id, { 'profile_pictures.profile': profilePicture })
        .then(data => { return data })
            .catch(err => console.log(err));
        console.log('profile photo updated')
    } else if (req.body.cover_picture){
        let coverPhoto = req.body.cover_picture;
        let currentUser = await User.findByIdAndUpdate(id, { 'profile_pictures.cover': coverPhoto })
        .then(data => { return data })
            .catch(err => console.log(err));
        console.log('cover photo updated')
    };
    //Add & Delete Photos
    if (req.body.deletePhotos) {
        let { deletePhotos } = req.body;
        for (let i = 0; i < deletePhotos.length; i++) {
            console.log(currentUser.profile_pictures)
            await cloudinary.uploader.destroy(deletePhotos[i]);
            await currentUser.updateOne({ $pull: { img: { filename: { $in: deletePhotos } } } });
            for (let picture in currentUser.profile_pictures) {
                if (currentUser.profile_pictures[picture].filename === deletePhotos[i]) {
                    currentUser.profile_pictures[picture] = {};
                }
                await currentUser.save();
            }
        };
    } else if (req.files && req.files.length) {
        for (let file of req.files) {
            currentUser.img.push({ filename: file.filename, path: file.path })
        }
        console.log(currentUser.img.length + ' Image Length Before')
        await currentUser.save();
        console.log(currentUser.img.length + ' Image Length After')
    };
    //Update Bio
    for (let el in req.body) {
        if (Object.keys(currentUser.bio).indexOf(el)) {
            switch (el) {
                case 'first_name':
                    let first_name = req.body[el];
                    await currentUser.updateOne({ 'bio.first_name': first_name })
                    break;
                case 'last_name':
                    let last_name  = req.body[el];
                    await currentUser.updateOne({ 'bio.last_name': last_name })
                    break;
                case 'location':
                    let location = req.body[el];
                    await currentUser.updateOne({ 'bio.location': location})
                    break;
                case 'from':
                    let from = req.body[el];
                    await currentUser.updateOne({ 'bio.from': from })
                    break;
                case 'relationship_status':
                    let relationship_status = req.body[el];
                    await currentUser.updateOne({ 'bio.relationship_status': relationship_status })
                    break;
                case 'blurb':
                    let blurb = req.body[el]
                    await currentUser.updateOne({ 'bio.blurb': blurb})
                    break;
            }
        }
    }
    /////MOST RECENT WORK is to finish user bio edit ^^^^
    console.log('EDIT PHOTOS WORKING')
    res.redirect(`/user${currentUser.id}`)
};


///see all photos button
///edit photos add and delete
///edit bio/profile



