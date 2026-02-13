const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "nimda",
  database: process.env.DB_NAME || "graphql",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = { pool };
