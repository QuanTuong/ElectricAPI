const { response } = require('express')
const express = require('express')
const router = require("express-promise-router")()
const passport = require('passport')
const { session } = require('passport')
require("../middlewares/passport")

const UserService = require("../services/UserService")


router.route("/list")
    .get(passport.authenticate('jwt', { session: false }),UserService.getListUser);
router.route("/search-user")
    .get(passport.authenticate('jwt', { session: false }),UserService.findUserByMobileOrEmail)
router.route("/search-user/:userId")    
    .get(passport.authenticate('jwt', { session: false }),UserService.findUserById)


router.route('/new')
    .post(passport.authenticate('jwt', { session: false }),UserService.signUpUser);
router.route('/signin')
    .post(passport.authenticate('local', { session: false }), UserService.signInUser);

router.route('/pwd/change')
    .put(passport.authenticate('jwt', { session: false }), UserService.changePasswordAll);
router.route('/pwd/reset')
    .put(passport.authenticate('jwt', { session: false }),UserService.adminResetPasswordAll);
router.route('/update-info/:userId')
    .put(passport.authenticate('jwt', { session: false }),UserService.adminResetPasswordAll,UserService.updateInfoUser)

router.route('/delete-user')
    .delete(passport.authenticate('jwt', { session: false }),UserService.deleteUser)



module.exports = router