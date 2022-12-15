const { Pool } = require('pg')

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "movie",
  password: "Cub30k3y"
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}