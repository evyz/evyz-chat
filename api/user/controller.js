const service = require("./service")

class UserController {
  async me(req, res, next) {
    return service.me(req, res, next)
  }

  async register(ctx) {
    return service.register(ctx)
  }

  async login(ctx) {
    return service.login(ctx)
  }
  async logout(ctx) {
    return ctx.res.json('logout')
  }

  async check(ctx) {
    return service.check(ctx)
  }

  async getUser(ctx) {
    return service.getUserForNickname(ctx)
  }
}

module.exports = new UserController()