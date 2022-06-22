require("dotenv").config()

module.exports = {
  "development": {
    "username": "rizkyian78",
    "password": "Rizkyian_78",
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
  },
  "test": {
    "username": "root",
    "password": "password",
    "database": "test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
}