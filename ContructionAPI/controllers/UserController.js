const { response } = require('express')
const express = require('express')
const router = require("express-promise-router")()
const passport = require('passport')
const { session } = require('passport')
require("../middlewares/passport")

const AccountService = require("../services/UserService")


router.route("/list")
    .get(passport.authenticate('jwt', { session: false }),AccountService.getListUser);
router.route("/search-user")
    .get(passport.authenticate('jwt', { session: false }),AccountService.findUserByMobileOrEmail)
router.route("/search-user/:userId")    
    .get(passport.authenticate('jwt', { session: false }),AccountService.findUserById)


router.route('/new')
    .post(passport.authenticate('jwt', { session: false }),AccountService.signUpUser);
router.route('/signin')
    .post(passport.authenticate('local', { session: false }), AccountService.signInUser);

router.route('/pwd/change')
    .put(passport.authenticate('jwt', { session: false }), AccountService.changePasswordAll);
router.route('/pwd/reset')
    .put(passport.authenticate('jwt', { session: false }),AccountService.adminResetPasswordAll);
router.route('/update-info/:userId')
    .put(passport.authenticate('jwt', { session: false }),AccountService.adminResetPasswordAll,AccountService.updateInfoUser)

router.route('delete-user')
    .delete(passport.authenticate('jwt', { session: false }),AccountService.deleteUser)



module.exports = router