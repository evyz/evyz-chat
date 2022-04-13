
exports.up = function (knex) {
  return knex.schema
    .createTable('Users', table => {
      table.increments('id').primary()
      table.string('nickname').unique()
      table.string('password')
    })
    .createTable('Chats', table => {
      table.increments('id').primary()
      table.string('title')
    })
    .createTable('Users_Chats', table => {
      table.increments('id')
      table.integer('userId').references('id').inTable('Users')
      table.integer('chatId').references('id').inTable('Chats')
      table.primary('id')
    })
    .createTable('Messages', table => {
      table.increments('id').primary()
      table.text('message')
      table.integer('authorId').references('id').inTable('Users')
      table.integer('chatId').references('id').inTable('Chats')
      table.date('date')
    })
};


exports.down = function (knex) {
  return knex.schema
    .dropTable('Users_Chats')
    .dropTable('Messages')
    .dropTable('Chats')
    .dropTable('Users')
};
