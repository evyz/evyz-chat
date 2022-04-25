const connect = require("./api/connect")
const types = require("./api/types")

module.exports = (ws, req, aWs) => {
  const sendMessage = async (message) => {
    let { type, params } = JSON.parse(message)
    if (type) {
      types(ws, req, aWs, type, params)
    }
  }

  let id = ws.id
  let aWss = aWs

  ws.on('message', sendMessage)
  ws.on('close', () => connect.disconnect(id, aWss))
}