const express = require('express')

const userService = require('./user.service')
const authMiddleware = require('../../middleware/auth')

const router = express.Router()

router.post('/', authMiddleware(['Admin']), userService.createUser)

router.post('/login', userService.userLogin)

router.post('/refresh-token', userService.refreshToken)

module.exports = router
