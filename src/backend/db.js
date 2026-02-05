const mariadb = require('mariadb');
const fs = require('fs');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  connectionLimit: 10
});

// Expose the Pool object within this module
module.exports = Object.freeze({
  pool: pool
});