const { getChats, getMessages, connectToChat, getOnline, disconnectUser, sendMessageToChat, userIsWriting, createChat } = require("../service")

module.exports = async (ws, req, aWs, type, params) => {
  switch (type) {
    case "get:chats":
      getChats(ws, req, aWs, params.page)
      break
    case "create:chat":
      if (params.title) {
        console.log("A")
        createChat(ws, req, aWs, params.title)
      }
      break
    case "get:chat":
      if (params.chatId && params.page) {
        getMessages(ws, req, params.chatId, params.page)
      }
      break
    case "connect:chat":
      if (params.chatId) {
        connectToChat(ws, req, aWs, params.chatId, params.userId)
      }
      break
    case "disconnect":
      disconnectUser(ws, req, aWs)
      break
    case "send:message":
      if (params.chatId && params.content) {
        sendMessageToChat(ws, req, aWs, params.content, params.chatId)
      }
      break
    // case "send:writing":
    //   if (params.chatId) {
    //     userIsWriting(ws, req, aWs, params.chatId)
    //   }
    //   break

  }
}