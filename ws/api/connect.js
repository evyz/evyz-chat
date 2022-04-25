const online = require('../online')

class WsConnectService {
  async disconnect(id, aWs) {

    let obj,
      status = true
    online.map(user => {
      if (user.id === id) {
        obj = user
        status = false
      }
    })

    if (status) {
      aWs.clients.forEach(client => {
        console.log(client.id)
        client.send(JSON.stringify({ type: "disconnect", user: req.user }))
      })
    }

  }
}

module.exports = new WsConnectService()