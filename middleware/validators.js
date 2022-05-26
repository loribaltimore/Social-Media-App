let joi = require('joi');
let { AppError } = require('./errors');

module.exports.userValidate = async function (req, res, next) {
    let userSchema = joi.object({
        email: joi.string().required(),
        img: joi.array().items(joi.object({ filename: joi.string(), path: joi.string() })),
        friend_id: joi.string(),
            first_name: joi.string().required(),
            last_name: joi.string().required(),
            location: joi.string(),
            from: joi.string(),
            relationship_status: joi.string(),
            blurb: joi.string().min(20),
        notifications: joi.array().items(joi.string())
    });

    let { error } = userSchema.validate(req.body);
    if (error) {
        throw new AppError(error, 404)
    }
    next()
};


module.exports.editUserBio = function (req, res, next) {
    try {
        let bioSchema = joi.object({
            first_name: joi.string(),
            last_name: joi.string(),
            location: joi.string(),
            from: joi.string(),
            relationship_status: joi.string(),
            blurb: joi.string().max(150).min(20)
        });
        let { error } = bioSchema.validate(req.body);
        if (error) {
            throw new AppError(error.details[0].message, 404)
        }
        next();
    }
    catch (err) {
       next(err)
    }
   
}

//maybe add mapbox with geocoding in the from/to to validate legitimate places

///learned how to use try catch blocks and that if i want error handling to work the error needs to be 'caught' 
//only when it is caught will the function stop and fall to the errhandler. this is good to know.
///now I can have different errors in different places and know how they work. this was not a waste of time
///we have to figure out where we are setting headers. 
////async functions need try and catch blocks so it knows what do do when there is a failure. 
////the utility creates a function that calls the function passed as an argument into the utility with a 
///catch block at the end of it which makes it a lot easier thant writing try and catch blocks over and over
///this is what allows the error handler to activate. An error is caught and then 'nexted' to the err handler
