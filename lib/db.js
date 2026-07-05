const { Pool } = require('pg');

const pool = new Pool({
  host: 'xxxxx',
  port: xxxxx,
  user: 'xxxxxx',
  password: 'xxxxxx',
  database: 'xxxxxxxx',
  ssl: { rejectUnauthorized: false }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
