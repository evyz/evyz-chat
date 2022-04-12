const service = require("./service")

class MessageController {
  async get(req, res, next) {
    return service.getChats(req, res, next)
  }
  async getChat(ctx) {
    return ctx.res.json('getChat')
  }
  async getChatWithUser(req, res, next) {
    return service.getChat(req, res, next)
  }
  async createChat(req, res, next) {
    return service.createChat(req, res, next)
  }
}

module.exports = new MessageController()