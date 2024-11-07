import pool from '../../../../lib/db';

export async function GET() {
  console.log("GET request received at /api/events");

  try {
    // Attempt to query the database
    const result = await pool.query('SELECT * FROM events ORDER BY start_time ASC');
    console.log("Database query successful:", result.rows);

    // Return the result as a JSON response
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);

    // Return error details in the response
    return new Response(JSON.stringify({ error: 'Error fetching events', details: error.message }), { status: 500 });
  }
}
