const express = require('express')
const route = express()

const controller = require('./controller')
const auth = require('../../middlewares/auth')


/**
 * @swagger
 * /user/me:
 *   get:
 *     description: Запрос на получения данных о пользователе
 *  
 */
route.get('/me', auth, controller.me)

route.post('/register', controller.register)
route.post('/login', controller.login)
route.post('/check', auth, controller.check)
route.post('/logout', auth, controller.logout)

route.get('/:nickname', auth, controller.getUser)

module.exports = route