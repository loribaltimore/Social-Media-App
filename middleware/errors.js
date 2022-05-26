class AppError extends Error{
    constructor(message, status) {
        super(),
        this.message = message;
        this.status = status;
}
}

module.exports.AppError = AppError;

module.exports.errHandler = (err, req, res, next) => {
    let { message, status } = err;
res.render('error', {message, status})
}