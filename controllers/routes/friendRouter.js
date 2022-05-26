let express = require('express');
let friendRouter = express.Router({ mergeParams: true });
let { isLoggedIn, locals } = require('../../middleware/misc');
let { showAllFriends, renderFriendPosts, addFriend,
    acceptFriend, deleteFriend, dismissNotification, renderFriendAbout } = require('../friendController');

friendRouter.use(locals, isLoggedIn);
friendRouter.get('/', showAllFriends);
friendRouter.route('/:friend_id')
    .get(renderFriendPosts)
    .post(addFriend)
    .put(acceptFriend)
    .delete(deleteFriend);
friendRouter.get('/:friend_id/about', renderFriendAbout)
friendRouter.put('/:friend_id/dismiss', dismissNotification);

module.exports = friendRouter;