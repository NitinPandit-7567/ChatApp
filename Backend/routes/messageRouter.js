const express = require('express');
const router = express.Router({ mergeParams: true });
const isLoggedIn = require('../middleware/isLoggedIn')
// const AppError = require('../utils/AppError')
// const wrapAsync = require('../utils/wrapAsync')
// const Users = require('../models/users')
// const Messages = require('../models/messages')
const messageController = require('../controllers/messages')
router.route('/new/:id')
    .post(isLoggedIn, messageController.new)
router.route('/index')
    .get(isLoggedIn, messageController.index)
router.route('/:id')
    .get(isLoggedIn, messageController.load)
    .post(isLoggedIn, messageController.post)
// router.route('') need to do one for seen
module.exports = router;

