const { response } = require('express')
const express = require('express')
const router = require("express-promise-router")()
const passport = require('passport')
const { session } = require('passport')
require("../middlewares/passport")

const deviceService = require("../services/DeviceService")

router.route('/new')
    .post(passport.authenticate('jwt', { session: false }),deviceService.addNewDevice);

router.route('/update/:deviceId')
    .put(passport.authenticate('jwt', { session: false }),deviceService.updateDevice)

router.route('/delete/:deviceId')
    .delete(passport.authenticate('jwt', { session: false }),deviceService.deleteDevice);

module.exports = router