const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',                  // Your PostgreSQL username
  host: 'localhost',                 // Your host, usually 'localhost'
  database: 'timewise_db',           // Your database name
  password: 'Postgres.2004',         // Your password
  port: 5433,                        // The port you're using, here it’s 5433
});

module.exports = pool;
