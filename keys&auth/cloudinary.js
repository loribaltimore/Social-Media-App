let cloudinary = require('cloudinary').v2;
let { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

let storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'user-photos',
        allowed_formats: ['jpeg', 'jpg', 'png']
    }
});

module.exports = {
    storage,
    cloudinary
};