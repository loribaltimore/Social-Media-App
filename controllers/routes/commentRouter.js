let express = require('express');
let commentRouter = express.Router({ mergeParams: true });
let { isLoggedIn, locals, isAuthComment} = require('../../middleware/misc');
let { addComment, likeComment,  deleteComment, editComment } = require('../commentController');

commentRouter.use(locals, isLoggedIn)
commentRouter.post('/', addComment);
commentRouter.post('/:comment_id/like', likeComment);
commentRouter.route('/:comment_id')
    .put(isAuthComment, editComment)
    .delete(isAuthComment, deleteComment);
module.exports = commentRouter;
