const { response } = require('express')
const express = require('express')
const router = require("express-promise-router")()
const passport = require('passport')
const { session } = require('passport')
require("../middlewares/passport")

const AccountService = require("../services/AccountService")

router.route('/new')
    .post(passport.authenticate('jwt', { session: false }),AccountService.signUp);
router.route('/signin')
    .post(passport.authenticate('local', { session: false }), AccountService.signIn)
router.route('/pwd/change')
    .put(passport.authenticate('jwt', { session: false }), AccountService.changePassword)
router.route('/pwd/reset')
    .put(passport.authenticate('jwt', { session: false }),AccountService.adminResetPassword)


module.exports = router