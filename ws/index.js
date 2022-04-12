const types = require("./api/types")

module.exports = (ws, req, aWs) => {
  const sendMessage = async (message) => {
    let { type, params } = JSON.parse(message)
    if (type) {
      types(ws, req, aWs, type, params)
    }
  }

  ws.on('message', sendMessage)
}