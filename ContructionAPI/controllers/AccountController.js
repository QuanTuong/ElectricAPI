const { response } = require('express')
const express = require('express')
const router = require("express-promise-router")()
const passport = require('passport')
const { session } = require('passport')
require("../middlewares/passport")

const AccountService = require("../services/AccountSerice")


router.route("/list")
    .get(passport.authenticate('jwt', { session: false }),AccountService.getListUser);


module.exports = router