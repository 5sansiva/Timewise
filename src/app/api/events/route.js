// Name: Venkat Sai Eshwar Varma Sagi (VXS210103)

// Import the database connection pool to interact with the PostgreSQL database
import pool from '../../../../lib/db';

// Define an asynchronous GET handler to retrieve events from the database
export async function GET() {
  // Log a message to the console to indicate a GET request was received
  console.log("GET request received at /api/events");

  try {
    // Query the database for all events, ordered by start time in ascending order
    const result = await pool.query('SELECT * FROM events ORDER BY start_time ASC');
    
    // Log a message indicating a successful query with the retrieved data
    console.log("Database query successful:", result.rows);

    // Respond with the result of the query in JSON format and a 200 status code
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    // Log an error message if the database query fails
    console.error("Error fetching events:", error);

    // Return an error response with a 500 status code and error details
    return new Response(JSON.stringify({ error: 'Error fetching events', details: error.message }), { status: 500 });
  }
}
