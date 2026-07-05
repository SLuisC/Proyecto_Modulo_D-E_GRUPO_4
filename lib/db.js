const { Pool } = require('pg');

const pool = new Pool({
  host: 'postgresql-212395-0.cloudclusters.net',
  port: 19963,
  user: 'lcabezas',
  password: 'lcabezas0951',
  database: 'bd_lcabezas',
  ssl: { rejectUnauthorized: false }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};