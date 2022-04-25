require('dotenv').config()

const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)

const api = require('./api/index')
const cors = require('cors')

const errorHandling = require('./error/errorHandling')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger/config.json')

const aWs = expressWs.getWss('/api/ws')
const authWs = require('./middlewares/authWs')
const wsApi = require('./ws/index')
const online = require('./ws/online')

app.use(express.json())
app.use(cors())
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', api)

app.use(errorHandling)

app.ws('/api/ws', async (ws, req) => {
  let { authorization } = req.query

  let result = await authWs(authorization)
  if (!result) {
    ws.send(JSON.stringify({ error: "Ошибка авторзации" }))
    return ws.close()
  }

  ws.id = result.obj.id
  req.user = { id: result.obj.id, nickname: result.obj.nickname }

  let status = true

  online.map(user => {
    if (user.id === req.user.id) {
      status = false
    }
  })

  if (status) {
    online.push(req.user)
    if (online.length !== 0) {
      aWs.clients.forEach(client => {
        client.send(JSON.stringify({ type: "get:online", user: req.user }))
      })
    }
  }

  online.map(user => ws.send(JSON.stringify({ type: "get:online", user })))

  wsApi(ws, req, aWs)
})

app.listen(process.env.CONFIG_PORT, () => {
  console.log(`Server on ${process.env.CONFIG_PORT}`)
})