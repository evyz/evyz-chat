# Бекенд Evyz-chat мессенджера

## Установка и запуск

.env
```
CONFIG_PORT = 
SECRET_KEY = ""
DB_NAME = ""
DB_USER = ""
DB_PASS = ""
```
Миграции:
```
npx knex migrate:up --knexfile db/knexfile.js
npx knex migrate:down --knexfile db/knexfile.js
```

