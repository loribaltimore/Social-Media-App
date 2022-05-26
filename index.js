if (process.env.NODE_env !== 'production') {
    require('dotenv').config()

};
let express = require('express');
let app = express();
let path = require('path');
let methodOverride = require('method-override');
let bodyParser = require('body-parser');
let passport = require('passport');
let LocalStrategy = require('passport-local');
let session = require('express-session');
let flash = require('connect-flash');
let multer = require('multer');
let User = require('./models/userModel');
let { errHandler } = require('./middleware/errors');
let cloudinary = require('cloudinary').v2;
let { StorageCloudinary } = require('multer-storage-cloudinary');
let ejs = require('ejs');
let ejsMate = require('ejs-mate');
let mongoose = require('mongoose');
let userRouter = require('./controllers/routes/userRouter');
let friendRouter = require('./controllers/routes/friendRouter');
let postRouter = require('./controllers/routes/postRouter');
let commentRouter = require('./controllers/routes/commentRouter');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.listen(3000, () => {
    console.log('Server is Live')
});

mongoose.connect('mongodb://localhost:27017/facebook')
    .then(data => console.log('Database is Live'))
    .catch(err => console.log(err));

app.use(session({
    secret: 'thisisasecret',
    saveUninitialized: true,
    resave: false,
}));
app.use(flash());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session({}));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use('/user', userRouter);
app.use('/user/:id/post', postRouter);
app.use('/user/:id/friends', friendRouter);
app.use('/user/:id/post/:post_id/comment', commentRouter);
app.use(errHandler);
