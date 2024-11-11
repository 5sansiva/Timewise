// Name: Venkat Sai Eshwar Varma Sagi (VXS210103)

// Import the database connection pool to interact with the PostgreSQL database
import pool from '../../../../../lib/db';

// Define an asynchronous PUT handler to update an existing event in the database
export async function PUT(req, context) {
  // Extract the event ID from the request context parameters
  const { id } = await context.params;
  
  // Extract the updated event details from the request body
  const { title, description, start_time, end_time, is_recurring, recurrence_pattern, priority, all_day } = await req.json();

  try {
    // Update the specified event in the database with the provided details
    const result = await pool.query(
      `UPDATE events
       SET title = $1, description = $2, start_time = $3, end_time = $4, is_recurring = $5, 
           recurrence_pattern = $6, priority = $7, all_day = $8, updated_at = NOW()
       WHERE id = $9 RETURNING *`,
      [title, description, start_time, end_time, is_recurring, recurrence_pattern, priority, all_day, id]
    );

    // Respond with the updated event in JSON format and a 200 status code
    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (error) {
    // Return an error response with a 500 status code if the update fails
    return new Response(JSON.stringify({ error: 'Error updating event', details: error.message }), { status: 500 });
  }
}

// Define an asynchronous DELETE handler to remove an event from the database
export async function DELETE(req, context) {
  // Extract the event ID from the request context parameters
  const { id } = await context.params;

  try {
    // Execute a query to delete the event by ID and return the deleted event data
    const result = await pool.query(`DELETE FROM events WHERE id = $1 RETURNING *`, [id]);

    // Check if an event was found and deleted; if not, return a 404 response
    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Event not found' }), { status: 404 });
    }

    // Return a success message and a 200 status code if deletion is successful
    return new Response(JSON.stringify({ message: 'Event deleted successfully' }), { status: 200 });
  } catch (error) {
    // Log error details to the console and return a 500 error response if deletion fails
    console.error('Error deleting event:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete event', details: error.message }), { status: 500 });
  }
}

// Define an asynchronous GET handler to retrieve an event by ID from the database
export async function GET(req, { params }) {
  // Extract the event ID from the request parameters
  const { id } = params;

  try {
    // Query the database to find the event with the specified ID
    const result = await pool.query(`SELECT * FROM events WHERE id = $1`, [id]);

    // Check if the event exists; if not, return a 404 response
    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Event not found' }), { status: 404 });
    }

    // Return the found event in JSON format and a 200 status code
    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (error) {
    // Return an error response with a 500 status code if retrieval fails
    return new Response(JSON.stringify({ error: 'Error fetching event', details: error.message }), { status: 500 });
  }
}
