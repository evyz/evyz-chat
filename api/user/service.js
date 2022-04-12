const knex = require('../../db/index')
const { badRequest } = require('../../error/apiError')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


class UserService {
  async register(ctx) {
    const { nickname, password } = ctx.body
    if (!nickname || !password) {
      return ctx.next(badRequest('Не указано одно из полей'))
    }

    let check = await knex('Users').where({ nickname })
    if (check.length > 0) {
      return ctx.next(badRequest('Данный никнейм уже занят'))
    }

    let hashPass = bcrypt.hashSync(password, 5)

    const user = await knex('Users').insert({ nickname, password: hashPass })

    return ctx.res.json(user)
  }

  async login(ctx) {
    const { nickname, password } = ctx.body

    if (!nickname || !password) {
      return ctx.next(badRequest('Не указано одно из полей'))
    }

    let check = await knex('Users').where({ nickname })
    if (check.length === 0) {
      return ctx.next(badRequest('Данный никнейм уже занят'))
    }

    let obj = check[0]

    if (!bcrypt.compareSync(password, obj.password)) {
      return ctx.next(badRequest('Неверный пароль'))
    }

    let token = this.generateJwt(obj.id, obj.nickname)

    return ctx.res.json({ token: token })
  }

  async check(ctx) {
    const { id, nickname } = ctx.user

    let check = await knex('Users').where({ id, nickname })
    if (check.length === 0) {
      return ctx.next(badRequest('Неверный JWT-токен'))
    }

    let obj = check[0]

    const token = this.generateJwt(obj.id, obj.nickname)

    return ctx.res.json({ token: token })
  }

  generateJwt(id, nickname) {
    return jwt.sign({ id, nickname }, process.env.SECRET_KEY, { expiresIn: '48h' })
  }

  async getUser(id) {
    let check = await knex('Chats').where({ id })
    if (check.length === 0) {
      return null
    }
    return check[0]
  }

  async getMessages(id) {
    let result = await knex.select("*").from("Chats").innerJoin('Messages', 'Messages.chatId', 'Chats.id').where({ "Chats.id": id })
    return result
  }

  async sendMessage(chatId, message, authorId) {
    let result = await knex('Messages').insert({ message, authorId, chatId })
    return result
  }

  async me(req, res, next) {
    const { id } = req.user
    const result = await knex('Users').where({ id })

    return res.json(result[0])
  }

  async getUserForNickname(ctx) {
    const { nickname } = ctx.query

    let check = await knex('Users').where({ nickname }).value()

    return ctx.res.json(check)
  }

}

module.exports = new UserService()