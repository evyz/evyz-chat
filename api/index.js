const express = require('express')
const route = express()

const user = require('./user/route')
const message = require('./message/route')

route.use('/user', user)
route.use('/chat', message)

module.exports = route