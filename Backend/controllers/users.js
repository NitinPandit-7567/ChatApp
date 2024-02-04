const Users = require('../models/users')
const AppError = require('../utils/AppError')
const wrapAsync = require('../utils/wrapAsync')
module.exports.create = wrapAsync(async (req, res, next) => {
    const user = new Users({ ...req.body });
    await user.save()
    console.log(`User ${req.body.username} has registered successfully.`)
    req.session.user_id = user._id;
    res.send({ user: user, session_id: req.session.user_id })
})

module.exports.login = wrapAsync(async (req, res, next) => {
    const { username, password } = req.body
    const validation = await Users.findAndValidate(username, password)
    if (validation) {
        console.log(`User ${username} has logged in successfully.`)
        req.session.user_id = validation._id.toString()
        console.log('Session ID: ', req.session.user_id)
        res.send({ username: validation.username, email: validation.email, phone: validation.contact, user_id: validation._id, session_id: req.session.user_id, })
    }
    else {
        res.send({ status: 'error', message: 'Incorrect username or password' })
    }
})

module.exports.logout = wrapAsync(async (req, res, next) => {
    console.log(`User ${req.session.user_id} has logged out`)
    req.session.user_id = null;
    res.json({ status: "LoggedOut" })
})