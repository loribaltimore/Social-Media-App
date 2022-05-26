let err = require('../middleware/errors');

let asyncCatch = function (fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => { next(err) })
    }
};

module.exports = asyncCatch;