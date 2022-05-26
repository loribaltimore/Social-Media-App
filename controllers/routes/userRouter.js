let express = require('express');
let userRouter = express.Router({ mergeParams: true });
let Post = require('../../models/postModel');
let User = require('../../models/userModel');
let Comment = require('../../models/commentModel');
let passport = require('passport');
let LocalStrategy = require('passport-local')
let multer = require('multer');
let { storage, cloudinary } = require('../../keys&auth/cloudinary');
let upload = multer({ storage });
let { userHome, searchAllUsers,
    renderLogin, userLogin,
    userSignup, userLogout, renderSignUp,
    deleteProfile, renderDeletePage,
    setProfilePicture, editUser } = require('../userController');
let { isLoggedIn, locals, isAuthUser } = require('../../middleware/misc');
let { userValidate, editUserBio } = require('../../middleware/validators');
let asyncCatch = require('../../utilities/asyncCatch')
const { render } = require('ejs');

userRouter.use( locals);
userRouter.route('/')
    .get( asyncCatch(renderLogin))
userRouter.route('/login')
    .get(asyncCatch(renderLogin))
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), asyncCatch(userLogin));
userRouter.route('/signup')
    .post(upload.array('img'), userValidate, asyncCatch(userSignup))
    .get(asyncCatch(renderSignUp))
userRouter.post('/logout', asyncCatch(userLogout))
userRouter.get('/:id/search', asyncCatch(searchAllUsers));
userRouter.route('/:id/delete')
    .get(asyncCatch(renderDeletePage))
userRouter.route('/:id')
    .get(isLoggedIn, userHome)
    .put(isAuthUser, editUserBio, asyncCatch(editUser))
    .delete(deleteProfile);
module.exports = userRouter;

