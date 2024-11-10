// src/app/api/events/[id]/route.js

import pool from '../../../../../lib/db';

export async function PUT(req, context) {
  const { id } = await context.params;  // Await context.params
  const { title, description, start_time, end_time, is_recurring, recurrence_pattern, priority, all_day } = await req.json();

  try {
    const result = await pool.query(
      `UPDATE events
       SET title = $1, description = $2, start_time = $3, end_time = $4, is_recurring = $5, recurrence_pattern = $6, priority = $7, all_day = $8, updated_at = NOW()
       WHERE id = $9 RETURNING *`,
      [title, description, start_time, end_time, is_recurring, recurrence_pattern, priority, all_day, id]
    );
    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error updating event', details: error.message }), { status: 500 });
  }
}

// Adding the DELETE handler
export async function DELETE(req, context) {
  const { id } = await context.params;  // Await context.params

  try {
    const result = await pool.query(`DELETE FROM events WHERE id = $1 RETURNING *`, [id]);

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Event not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Event deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete event', details: error.message }), { status: 500 });
  }
}


export async function GET(req, { params }) {
  const { id } = params;

  try {
    const result = await pool.query(`SELECT * FROM events WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Event not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching event', details: error.message }), { status: 500 });
  }
}