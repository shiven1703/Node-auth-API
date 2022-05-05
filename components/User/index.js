const express = require('express')
const userService = require('./user.service')
const router = express.Router()

router.get('/', userService.homeRoute)

router.post('/create', userService.createUser)

module.exports = router
