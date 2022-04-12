const chats = [{ id: 1 }, { id: 2 }, { id: 3 }]
const messages = [{ id: 1, message: "Приветики!!", chatId: 1, userId: 2, date: new Date(2022, 4, 5) }]
const usersChats = [{ id: 1, userId: 2, chatId: 1 }, { id: 1, userId: 2, chatId: 2 }, { id: 1, userId: 2, chatId: 3 }, { id: 1, userId: 1, chatId: 1 }]

const db = require('../db/index')
const online = require('./online')

class ServiceWs {
  async getChats(ws, req, aWs) {
    let arr = []

    usersChats.map(userChat => {
      if (userChat.userId === req.user.id) {
        chats.map(chat => {
          if (chat.id === userChat.chatId) {
            arr.push(chat)
          }
        })
      }
    })

    console.log(arr)

    arr.map(obj => ws.send(JSON.stringify({ type: "get:chats", ...obj })))
  }

  async getMessages(ws, req, chatId) {
    let users = await db.select(['id', 'nickname']).from('Users')

    let arr = []
    messages.map(async message => {
      if (message.chatId === chatId) {
        let nickname = users.find(user => user.id === message.userId).nickname
        console.log(message)
        arr.push({ ...message, nickname })
      }
    })

    arr.map(obj => ws.send(JSON.stringify({ type: "get:chat", ...obj })))
  }

  async getOnline(ws, req) {
    console.log(online)
    online.map(user => {
      ws.send(JSON.stringify({ type: "get:online", user: user }))
    })
  }

  async connectToChat(ws, req, chatId, userId) {
    chats.map(chat => {
      if (chat.id === chatId) {
        // let status = false
        // usersChats.map(userChat => {
        //   console.log(userChat)
        //   if (userChat.userId === userId) {
        //     status = true
        //     ws.send('Вы уже подключены к этому чату')
        //   }
        // })
        // if (!status) {
        let obj = { id: usersChats.length, userId: userId, chatId }
        usersChats.push(obj)
        ws.send(JSON.stringify({ type: "get:chats", ...obj }))
      }
      // }
    })
  }

  disconnectUser(ws, req, aWs) {
    let index = online.findIndex(user => user.id === req.user.id)
    online.splice(index, 1)

    aWs.clients.forEach(client => client.send(JSON.stringify({ type: "disconnect", user: req.user })))

    ws.close()
  }

  async sendMessageToChat(ws, req, aWs, message, chatId) {
    let arr = []

    let obj = { id: messages.length, message: message, chatId: chatId, userId: req.user.id, date: new Date() }
    messages.push(obj)

    usersChats.map(userChat => {
      if (userChat.chatId === chatId) {
        arr.push(userChat)
      }
    })

    aWs.clients.forEach(client => {
      arr.map(user => {
        if (client.id === user.userId) {
          client.send(JSON.stringify({ type: "get:message", ...obj }))
        }
      })
    })

    ws.send(JSON.stringify({ type: "get:message", ...obj }))
  }

  async userIsWriting(ws, req, aWs, chatId) {
    let status = false
    usersChats.map(userChat => {
      if (userChat.chatId === chatId) {
        status = true
      }
    })
    if (status) {
      let arr = []
      usersChats.map(userChat => {
        if (userChat.chatId === chatId) {
          arr.push(userChat)
        }
      })

      aWs.clients.forEach(client => {
        arr.map(user => {
          if (client.id === user.userId) {
            client.send(JSON.stringify({ type: "send:writing", chatId, userId: req.user.id }))
          }
        })
      })
    }
  }

}

module.exports = new ServiceWs()