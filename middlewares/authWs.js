const knex = require('../db/index')
const jwt = require('jsonwebtoken')

module.exports = async (token) => {
  let status = false

  if (!token) {
    return status = false
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY)
  let check = await knex('Users').where({ id: decoded.id })
  if (check.length === 0) {
    return status = false
  }

  status = true

  return {
    status, obj: {
      id: check[0].id,
      nickname: check[0].nickname
    }
  }
}