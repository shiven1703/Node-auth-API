const express = require('express')
const userService = require('./user.service')
const router = express.Router()

router.post('/', userService.createUser)

router.post('/login')

module.exports = router
