let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let model = mongoose.model;
let User = require('./userModel');
let passport = require('passport');
const Post = require('./postModel');
let Notification = require('./notificationModel')
let Comment = require('./commentModel')
mongoose.connect('mongodb://localhost:27017/facebook')
    .then(data => console.log('Server is Live'))
    .catch(err => console.log(err));
let { names } = require('./seedNames');
let cities  = require('./cities');
let lorem = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, in debitis accusamus ducimus blanditiis delectus omnis voluptas consequatur ipsa similique a recusandae obcaecati excepturi necessitatibus impedit ratione sint vero magni!'
lorem = lorem.slice(0, 250);


let userSeed = async function () {
    let allUsers = await User.deleteMany({});
    let randomFirstName = Math.floor(Math.random() * names.length);
    let randomLastName = Math.floor(Math.random() * names.length);
    let randomCity = Math.floor(Math.random() * cities.length);
    let randomFrom = Math.floor(Math.random() * cities.length);
    let password = 'dev';
    let newUser = await new User({
        email: `dev@gmail.com`,
        username: `dakota`,
        bio: {
            first_name: 'Dakota',
            last_name: 'Bing',
            location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
            from: `${cities[randomFrom].city}, ${cities[randomFrom].state}`,
            relationship_status: 'Single',
            member_since: Date(),
            blurb: 'I have the only real and intentional profile! Im the original user.'
        },
        img: [
            {
                path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1645419700/user-photos/vo78sn3zy3ubxkou7dio.jpg',
                filename: 'user-photos/vo78sn3zy3ubxkou7dio',
            },
            {
                path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1645419700/user-photos/icj0jz9ud4jjcjwxzboa.jpg',
                filename: 'user-photos/icj0jz9ud4jjcjwxzboa',
            },
            {
                path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1645419700/user-photos/vo78sn3zy3ubxkou7dio.jpg',
                filename: 'user-photos/vo78sn3zy3ubxkou7dio',
            },
            {
                path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1645419700/user-photos/icj0jz9ud4jjcjwxzboa.jpg',
                filename: 'user-photos/icj0jz9ud4jjcjwxzboa',
            }
        ],
        friend_id: mongoose.Types.ObjectId()
    });
    await User.register(newUser, password);
    await newUser.save()
        .then(data => { console.log(data); return data })
        .catch(err => console.log(err));

    for (let i = 0; i < 10; i++) {
        let randomFirstName = Math.floor(Math.random() * names.length);
        let randomLastName = Math.floor(Math.random() * names.length);
        let randomCity = Math.floor(Math.random() * cities.length);
        let randomFrom = Math.floor(Math.random() * cities.length);
        let newUser = await new User({
            email: `dev${i}@gmail.com`,
            username: `dev${i}`,
            img: [
                {
                    path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1645419700/user-photos/vo78sn3zy3ubxkou7dio.jpg',
                    filename: 'user-photos/vo78sn3zy3ubxkou7dio',
                },
                {
                    path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1645419700/user-photos/icj0jz9ud4jjcjwxzboa.jpg',
                    filename: 'user-photos/icj0jz9ud4jjcjwxzboa',
                },
                {
                    path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1645419700/user-photos/vo78sn3zy3ubxkou7dio.jpg',
                    filename: 'user-photos/vo78sn3zy3ubxkou7dio',
                },
                {
                    path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1645419700/user-photos/icj0jz9ud4jjcjwxzboa.jpg',
                    filename: 'user-photos/icj0jz9ud4jjcjwxzboa',
                }
            ],
            bio: {
                first_name: names[randomFirstName],
                last_name: names[randomLastName],
                location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
                from: `${cities[randomFrom].city}, ${cities[randomFrom].state}`,
                relationship_status: 'Single',
                member_since: Date(),
                blurb: 'This is supposed to showcase my wittiness, intent, or personality!'
            },
            friend_id: mongoose.Types.ObjectId(),
        });
        await User.register(newUser, password);
        await newUser.save()
            .then(data => { console.log(data); return data })
            .catch(err => console.log(err));
    }
};


// userSeed();

// let postSeeds = async function () {
//     let currentUser = await User.findOne({ username: 'dev3' });


// }

let postSeedsFill = async function () {
    let allPosts = Post.deleteMany({}).then(data => console.log(data)).catch(err => console.log(err));
    let allUsers = await User.find({});

    let allUserIds = allUsers.map(x => x.id);
  
    for (let id of allUserIds) { 
        for (let i = 0; i <= 5; i++) {
            let randomUser = Math.floor(Math.random() * allUserIds);
            let newPost = await new Post({
                author: id,
                text: lorem,
                img: [
                    {
                        path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1645419700/user-photos/vo78sn3zy3ubxkou7dio.jpg',
                        filename: 'user-photos/vo78sn3zy3ubxkou7dio',
                    },
                        {
                            path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1645419700/user-photos/icj0jz9ud4jjcjwxzboa.jpg',
                            filename: 'user-photos/icj0jz9ud4jjcjwxzboa',
                        }
                ],
                postDate: Date(),
            });
            await newPost.save()
                .then(data => { console.log(data); return data })
                .catch(err => console.log(err));
            let newComment = await new Comment({
                author: allUserIds[randomUser],
                body: 'this is a test comment',
                post_id: newPost.id
            }).save();
            newPost.comments.push(newComment);
            await newPost.save();
            let currentUser = await User.findById(id);
            currentUser.posts.push(newPost.id);
            currentUser.comments.push(newComment.id)
            await currentUser.save()
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        
    }
};

// postSeedsFill()

let friendSeeds = async function () {
    let allUsers = await User.find({});
    let mainUser = await User.findOne({ username: 'dakota' });
    let allUsersMod = allUsers.filter(function (x) {
        if (x.username !== mainUser.username) {
            return x
        }
    });

    allUsersMod.forEach(function (el, index) {
        mainUser.friends.push(el.friend_id)
    });   
    await mainUser.save()
        .then(data => console.log(data))
        .catch(err => console.log(err));
};

// friendSeeds();

let singlePostFill = async function () {
    let id = "6212fa51373bbc97f478fac2";
    let thisUser = await User.findById(id);
    let posts = await Post.find({});
    for (let i = 0; i < 10; i++){
        thisUser.posts.push(posts[i].id);
    }
    await thisUser.save().then(data => console.log(data)).catch(err => console.log(err));
};

// singlePostFill();

// let dev5Friends = async function () {
//     let id = "6212fa51373bbc97f478fac2";
//     let thisUser = await User.findById(id);
//     let allUsers = await User.find({});
//     allUsers.forEach((el, i) => {
//         thisUser.friends.push

//     })

// }

let addImgPost = async function () {
    let allPosts = await Post.find({});
    allPosts.forEach(async function (el, index) {
        el.img.push({
            path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1645419700/user-photos/vo78sn3zy3ubxkou7dio.jpg',
            filename: 'user-photos/vo78sn3zy3ubxkou7dio',
        },
            {
                path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1645419700/user-photos/icj0jz9ud4jjcjwxzboa.jpg',
                filename: 'user-photos/icj0jz9ud4jjcjwxzboa',
            })
        await el.save();
    })
};

// addImgPost();


let addImg = async function () {
    let allUsers = await User.find({});
    for (let i = 0; i < allUsers.length; i++){
        allUsers[i].img.push({
            path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1645419700/user-photos/vo78sn3zy3ubxkou7dio.jpg',
            filename: 'user-photos/vo78sn3zy3ubxkou7dio',
        },
            {
                path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1645419700/user-photos/icj0jz9ud4jjcjwxzboa.jpg',
                filename: 'user-photos/icj0jz9ud4jjcjwxzboa',
            })
        await allUsers[i].save();
    }
}

// addImg()

let newNames = async function () {
    let allUsers = await User.find({});
    for (let user of allUsers) {
        let randomFirstName = Math.floor(Math.random() * names.length);
        let randomLastName = Math.floor(Math.random() * names.length);
        let randomCity = Math.floor(Math.random() * cities.length);
        let randomFrom = Math.floor(Math.random() * cities.length);
        let nameChange = await User.findByIdAndUpdate(user.id, {
            bio: {
                first_name: names[randomFirstName],
                last_name: names[randomLastName],
                location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
                from: `${cities[randomFrom].city}, ${cities[randomFrom].state}`,
                relationship_status: 'Single',
                member_since: Date(),
                blurb: 'This is supposed to showcase my wittiness, intent, or personality!'
        }}).then(data => console.log(data)).catch(err => console.log(err));
    }
}
// newNames()



let newComments = async function () {
    let allCommentsDelete = await Comment.deleteMany({});
    let allPosts = await Post.find({});
    let allUsers = await User.find({});
  
    let randomPost = Math.floor(Math.random() * allPosts.length);
    
    for (let post of allPosts) {
        post.comments = [];
        await post.save()
    }
   
    for (let user of allUsers) {
        user.comments = [];
        await user.save()
    }
    for (let j = 0; j < allPosts.length; j++){
        let post = await Post.findById(allPosts[j].id);
        for (let i = 0; i < 10; i++) {
            let randomUser = Math.floor(Math.random() * allUsers.length);
            let user = await User.findById(allUsers[randomUser].id);
            let newComment = await new Comment({
                author: user,
                body: lorem.slice(0, 75),
                post_id: post
            }).save();
            user.comments.push(newComment);
            post.comments.push(newComment);
            await user.save()
        };
        await post.save()
        
    }
};

// newComments();

let newNotifications = async function () {
    let deletedNotifications = await Notification.deleteMany({});
    let allUsers = await User.find({});
    let me = await User.findOne({ username: 'dakota' });
    me.notifications = [];
    for (let i = 0; i < 3; i++) {
        let randomUser = Math.floor(Math.random() * allUsers.length);
        let newNotify = await new Notification({
            toId: me.id,
            toName: me.bio.first_name + ' ' + me.bio.last_name,
            fromId: allUsers[randomUser],
            fromName: allUsers[randomUser].bio.first_name + ' ' + allUsers[randomUser].bio.last_name,
            category: 'User',
            sent: Date(),
            message: `${ allUsers[randomUser].bio.first_name } ${allUsers[randomUser].bio.last_name} has sent you a friend request!`
        }).save();
        me.notifications.push(newNotify);
        await me.save()
    }
};

let deleteFriend = async function () {
    let dakota = await User.findOne({ username: 'dakota' });
    dakota.friends = [];
    dakota.notifications = [];
    await dakota.save()

}
// deleteFriend();

let addSelf = async function () {
    let allUsers = await User.find({});
    for (let user of allUsers) {
        user.friends.push(user.friend_id);
        await user.save()
    }
}
// addSelf()

let seedProfPic = async (req, res, next) => {
    let allUsers = await User.find({});
    // for (let user of allUsers) {
    //     user.profile_pictures.profile = { path: user.img[0].path, filename: user.img[0].filename }
    //     await user.save()
    // }
    for (let user of allUsers) {
        user.profile_pictures.cover = { path: user.img[0].path, filename: user.img[0].filename }
        await user.save()
    }
    console.log('FINISHED')
};

// seedProfPic();

let allUsers = async function () {
    let users = await User.find({});
    let filtered = users.map(function (element, index) {
        return [element.username,
        element.img.map(function (x) {
            return x.filename
        }), element.profile_pictures.profile.filename,
        element.profile_pictures.cover.filename
        ]
    });
    console.log(filtered)
};
allUsers();
