const { getChats, getMessages, connectToChat, getOnline, disconnectUser, sendMessageToChat, userIsWriting } = require("../service")

module.exports = (ws, req, aWs, type, params) => {
  switch (type) {
    case "get:chats":
      getChats(ws, req, aWs)
      break
    case "get:chat":
      if (params.chatId) {
        getMessages(ws, req, params.chatId)
      }
      break
    case "connect:chat":
      if (params.chatId) {
        connectToChat(ws, req, params.chatId, params.userId)
      }
      break
    case "get:online":
      getOnline(ws, req)

    case "disconnect":
      disconnectUser(ws, req, aWs)
      break
    case "send:message":
      if (params.chatId && params.content) {
        sendMessageToChat(ws, req, aWs, params.content, params.chatId)
      }
      break
    case "send:writing":
      if (params.chatId) {
        userIsWriting(ws, req, aWs, params.chatId)
      }
      break
  }
}