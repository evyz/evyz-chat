const knex = require('../../db/index')
const { badRequest } = require('../../error/apiError')

class MessageService {
  async getChat(req, res, next) {
    const { userId } = req.params
    const { id } = req.user

    let chat = await knex('Chats').where({ fromId: id, toId: userId })
    if (chat.length === 0) {
      const result = await knex('Chats').insert({ fromId: id, toId: userId })
      chat = await knex('Chats').where({ fromId: id, toId: userId })
    }

    console.log(chat)

    return res.json(chat)
  }

  async getChats(req, res, next) {
    const { id } = req.user
    const result = await knex('Chats').where({ fromId: id }).orWhere({ toId: id })

    return res.json(result)
  }

  async createChat(req, res, next) {
    const { id } = req.user
    const { title } = req.body


    let check = await knex('Chats').where({ title })
    if (check.length > 0) {
      return next(badRequest('Чат с таким названием уже создан'))
    }
    let result = await knex('Chats').insert({ title })

    check = await knex('Chats').where({ title })
    result = await this.createUserChatConnection(id, check[0].id)

    return res.json(result)
  }

  async createUserChatConnection(id, chatId) {
    const knex = await knex('Users_Chats').insert({ 'userId': id, 'chatId': chatId })
    let result = await knex('Users_Chats').where({ 'userId': id, 'chatId': chatId })

    return result[0]
  }

}

module.exports = new MessageService()