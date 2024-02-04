const express = require('express');
const router = express.Router({ mergeParams: true });
const userController = require('../controllers/users')
const Users = require('../models/users')
const isLoggedIn = require('../middleware/isLoggedIn')
const AppError = require('../utils/AppError')
const wrapAsync = require('../utils/wrapAsync')
router.route('/new')
    .post(userController.create)
router.route('/login')
    .post(userController.login)
router.route('/logout')
    .post(isLoggedIn, userController.logout)

module.exports = router;
