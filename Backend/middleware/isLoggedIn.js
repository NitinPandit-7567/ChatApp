const Users = require('../models/users')
const AppError = require('../utils/AppError')
module.exports = async function (req, res, next) {
    if (req.session.user_id) {
        const user = await Users.findById(req.session.user_id);
        if (user) {
            return next()
        }
        else {
            return next(new AppError(401, 'You need to login'))
        }
    }
    else {
        return next(new AppError(401, 'You need to login'))
    }
}