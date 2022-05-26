let express = require('express');
let postRouter = express.Router({ mergeParams: true });
let { postPost, userLike, editPost, deletePost } = require('../postController');
let { storage } = require('../../keys&auth/cloudinary');
let multer = require('multer');
let upload = multer(storage);
let { isLoggedIn, locals, isAuthPost } = require('../../middleware/misc');

postRouter.use(locals, isLoggedIn);
postRouter.post('/', upload.array('img'), postPost);
postRouter.route('/:post_id')
    .put(isAuthPost, editPost)
    .delete(isAuthPost, deletePost);
postRouter.post('/:post_id/like', userLike);
module.exports = postRouter;