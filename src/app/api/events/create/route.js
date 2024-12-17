// Name: Venkat Sai Eshwar Varma Sagi (VXS210103)

// Import the database connection pool to interact with the PostgreSQL database
import pool from '../../../../../lib/db';

// Define an asynchronous POST handler to create a new event in the database
export async function POST(req) {
  // Destructure the event properties from the JSON payload of the request
  const { title, description, start_time, end_time, is_recurring, recurrence_pattern, priority, all_day } = await req.json();

  try {
    // Insert a new event into the events table using the provided properties
    const result = await pool.query(
      `INSERT INTO events (title, description, start_time, end_time, is_recurring, recurrence_pattern, priority, all_day)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description, start_time, end_time, is_recurring, recurrence_pattern, priority, all_day]
    );

    // Respond with the newly created event in JSON format and a 201 status code
    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (error) {
    // Return an error response with a 500 status code and error details if the insertion fails
    return new Response(JSON.stringify({ error: 'Error creating event', details: error.message }), { status: 500 });
  }
}
