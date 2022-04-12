const express = require('express')
const auth = require('../../middlewares/auth')
const controller = require('./controller')
const route = express()

route.get('/', auth, controller.get)
route.get('/:userId', auth, controller.getChatWithUser)

route.post('/', auth, controller.createChat)

module.exports = route
