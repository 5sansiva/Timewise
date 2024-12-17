// Name: Venkat Sai Eshwar Varma Sagi (VXS210103)

// Import the 'pg' library to interact with a PostgreSQL database
import pg from 'pg';

// Destructure the Pool class from the 'pg' module to create a connection pool
const { Pool } = pg;

// Create a new pool instance with database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'timewise_db',
  password: 'Postgres.2004',
  port: 5432,
});

// Set up an event listener for errors on the pool's idle clients
pool.on('error', (err) => {
  // Log any unexpected errors and exit the process with a non-zero status code
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Export the pool instance for use in other modules
export default pool;
