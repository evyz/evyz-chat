module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: "yt_evyz_chat",
      user: "postgres",
      password: "SdP+neyR3+P5"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    debug: true
  },
};
