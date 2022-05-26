let User = require('../models/userModel');
let Post = require('../models/postModel');
let Notification = require('../models/notificationModel');
let Comment = require('../models/commentModel');


module.exports.acceptFriend = async (req, res, next) => {
    let newFriendId = req.params.friend_id;
    let { notification_id } = req.body;
    let { id } = req.params;
    let newFriend = await User.findById(newFriendId);
    let { friend_id } = newFriend;
    let currentUser = await User.findById(id);
    if (currentUser.friends.indexOf(newFriend.friend_id) === -1) {
        currentUser.friends.push(newFriend.friend_id);
        newFriend.friends.push(currentUser.friend_id);
        currentUser.notifications.pull(notification_id)
        await currentUser.save();
        await newFriend.save();
        console.log('newFriend should working')
        req.flash('success', `You and ${newFriend.bio.first_name} are now friends!`);
    } else {
        console.log('already friends');
        currentUser.notifications.pull(notification_id)
        await currentUser.save();
    }
    console.log('putFriendWorking')
};

module.exports.addFriend = async (req, res, next) => {
    let { id } = req.params;
    let friendID = req.params.friend_id;
    let currentUser = await User.findById(id);
    let prospectiveFriend = await User.findOne({ friend_id: friendID });
    let newNotification = await new Notification({
        toId: prospectiveFriend.id,
        toName: `${prospectiveFriend.bio.first_name} ${prospectiveFriend.bio.last_name}`,
        fromId: currentUser.id,
        fromName: `${currentUser.bio.first_name} ${currentUser.bio.last_name}`,
        category: 'User',
        sent: Date(),
        message: `${currentUser.bio.first_name} ${currentUser.bio.last_name} wants to be your friend!`
    }).save();
    prospectiveFriend.notifications.push(newNotification.id);
    await prospectiveFriend.save();
};

module.exports.deleteFriend = async (req, res, next) => {
    let { id } = req.params;
    let friendCode = req.params.friend_id;
    let currentUser = await User.findById(id);
    let friend = await User.findOne({ friend_id: friendCode });
    currentUser.friends.pull(friendCode);
    friend.friends.pull(currentUser.friend_id);
    await currentUser.save();
    await friend.save();
    console.log(currentUser.friends.length)
    console.log(friend.friends.length)
    console.log('deletefriend WORKING')
};

module.exports.showAllFriends = async (req, res, next) => {
    let { id } = req.params;
    let currentUser = await User.findById(id);
    if (currentUser.friends.length > 1) {
        let allFriends = [];
        for (let i = 0; i < currentUser.friends.length; i++){
             let friend = await User.findOne({ friend_id: currentUser.friends[i] })
                .then(data => { allFriends.push(data)})
                 .catch(err => console.log(err));
        };
        return res.render('showAllFriends', {allFriends})
    }
    else {
        let allFriends = undefined;
        res.render('showAllFriends', {allFriends})
    }
    
}

module.exports.renderFriendPosts = async (req, res, next) => {
    let friendCode = req.params.friend_id;
    let friend = await User.findOne({ friend_id: friendCode })
        .then(data => { return data })
        .catch(err => console.log(err));
    console.log(friend)
    let commentAuthors = [];
    if (friend !== null && friend.posts.length) {
        console.log('POSTLENGTH')
        let allPosts = await friend.populate({ path: 'posts', populate: { path: 'comments' } });
        let { posts } = allPosts;
        posts = posts.sort(function (a, b) {
            return a.postDate - b.postDate
        });
        
        for (let i = 0; i < posts.length; i++) {
            for (let comment of posts[i].comments) {
                let authorPop = await User.findById(comment.author)
                    .then(data => { return data })
                    .catch(err => console.log(err));
                commentAuthors.push(`${authorPop.bio.first_name} ${authorPop.bio.last_name}`);
            }
        };
        return res.render('showFriendPosts', { friend, posts, commentAuthors })
    } else {
        let friend = await User.findOne({ friend_id: friendCode });
        let allPosts = await friend.populate({ path: 'posts', populate: { path: 'comments' } });
        let { posts } = allPosts;
        posts = posts.sort(function (a, b) {
            return a.postDate - b.postDate
        });
        res.render('showFriendPosts', { friend, posts, commentAuthors })
    }
};

module.exports.renderFriendAbout = async (req, res, next) => {
    let friendID = req.params.friend_id;
    let friend = await User.findOne({ friend_id: friendID })
        console.log(friend);
    res.render('showFriendAbout', {friend})
}

module.exports.dismissNotification = async (req, res, next) => {
    let { id } = req.params;
    let { notification_id } = req.body;
    let currentUser = await User.findById(id);
    console.log(currentUser.notifications)
    currentUser.notifications.pull(notification_id);
    await currentUser.save();
    console.log('dismissnotificationWORKING')
}