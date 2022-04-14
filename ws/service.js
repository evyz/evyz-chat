const chats = [{ id: 1 }, { id: 2 }, { id: 3 }]
const messages = [{ id: 1, message: "Приветики!!", chatId: 1, userId: 2, date: new Date(2022, 4, 5) }]
const usersChats = [{ id: 1, userId: 2, chatId: 1 }, { id: 1, userId: 2, chatId: 2 }, { id: 1, userId: 2, chatId: 3 }, { id: 1, userId: 1, chatId: 1 }]

const db = require('../db/index')
const online = require('./online')
const { attachPaginate } = require('knex-paginate');
attachPaginate();

class ServiceWs {
  async getChats(ws, req, aWs, page) {

    let query = await db
      .select('Chats.id', 'Chats.title')
      .from('Users_Chats')
      .innerJoin('Users', 'Users.id', 'Users_Chats.userId')
      .innerJoin('Chats', 'Chats.id', 'Users_Chats.chatId')
      .where({ 'Users_Chats.userId': req.user.id })
      .paginate({
        perPage: 40,
        currentPage: page
      })

    query.data.map(obj => ws.send(JSON.stringify({ type: "get:chats", ...obj })))
  }

  async getMessages(ws, req, chatId, page) {
    let query = await db
      .select('Messages.id', 'Messages.message', 'Users.id as userId', 'Users.nickname', 'Messages.chatId')
      .from('Messages')
      .innerJoin('Users', 'Users.id', 'Messages.authorId')
      .orderBy('Messages.id', 'desc')
      .where({ 'Messages.chatId': chatId })
      .paginate({
        perPage: 40,
        currentPage: page
      })

    query.data.map(obj => ws.send(JSON.stringify({ type: "get:chat", ...obj })))
  }

  // async getOnline(ws, req) {
  //   console.log(online)
  //   online.map(user => {
  //     ws.send(JSON.stringify({ type: "get:online", user: user }))
  //   })
  // }

  async connectToChat(ws, req, aWs, chatId, userId) {
    let obj = {}

    let query = await db
      .select('Users.id')
      .from('Users')
      .where({ "Users.id": userId })
      .first()

    if (!query) {
      ws.send({ error: "Неверный ID пользователя" })
    }

    query = await db
      .insert({ userId: userId, chatId: chatId })
      .into('Users_Chats')
      .then(async () => {
        obj = await db
          .select('Chats.id', 'Chats.title')
          .from('Users_Chats')
          .innerJoin('Chats', 'Chats.id', 'Users_Chats.chatId')
          .where({ userId: userId, chatId: chatId })
          .orderBy('id', 'desc')
          .limit(1)
          .first()
      })

    aWs.clients.forEach(client => {
      if (client.id === obj.id) {
        client.send(JSON.stringify({ type: "get:chats", ...obj }))
      }
    })
  }

  disconnectUser(ws, req, aWs) {
    let index = online.findIndex(user => user.id === req.user.id)
    online.splice(index, 1)

    aWs.clients.forEach(client => client.send(JSON.stringify({ type: "disconnect", user: req.user })))

    ws.close()
  }

  async sendMessageToChat(ws, req, aWs, message, chatId) {
    let obj = {}

    let query = await db
      .insert({ message, chatId, authorId: req.user.id })
      .into('Messages')
      .then(async () => {
        obj = await db
          .select('Messages.id', 'Messages.message', 'Users.id as userId', 'Users.nickname', 'Messages.chatId')
          .innerJoin('Users', 'Messages.authorId', 'Users.id')
          .from('Messages')
          .orderBy('Messages.id', 'desc')
          .limit(1)
          .first()
      })

    query = await db
      .select('Users.id', 'Users.nickname')
      .from('Users')
      .innerJoin('Users_Chats', 'Users.id', 'Users_Chats.userId')
      .where({ 'Users_Chats.chatId': chatId })


    aWs.clients.forEach(client => {
      query.map(user => {
        if (client.id === user.id) {
          client.send(JSON.stringify({ type: "get:message", ...obj }))
        }
      })
    })
  }

  // async userIsWriting(ws, req, aWs, chatId) {
  //   let status = false
  //   usersChats.map(userChat => {
  //     if (userChat.chatId === chatId) {
  //       status = true
  //     }
  //   })
  //   if (status) {
  //     let arr = []
  //     usersChats.map(userChat => {
  //       if (userChat.chatId === chatId) {
  //         arr.push(userChat)
  //       }
  //     })

  //     aWs.clients.forEach(client => {
  //       arr.map(user => {
  //         if (client.id === user.userId) {
  //           client.send(JSON.stringify({ type: "send:writing", chatId, userId: req.user.id }))
  //         }
  //       })
  //     })
  //   }
  // }
  async createChat(ws, req, aWs, title) {
    let obj = {}
    await db.insert({ title }).into('Chats')
      .then(id => {
        console.log(id)
      }).then(async () => {
        obj.chat = await db.select().from('Chats').orderBy('id', 'desc').limit(1).first()
      }).then(async () => {
        await db.insert({ userId: req.user.id, chatId: obj.chat.id }).into('Users_Chats')
      }).then(async () => {
        obj.chatConnection = await db.select().from('Users_Chats').orderBy('id', 'desc').limit(1).first()
      })

    ws.send(JSON.stringify(obj))
  }

}

module.exports = new ServiceWs()