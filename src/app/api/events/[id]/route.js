// src/app/api/events/[id]/route.js
import pool from '../../../../../lib/db';

export async function PUT(req, { params }) {
  const { id } = params;
  const { title, description, start_time, end_time, is_recurring, recurrence_pattern, priority } = await req.json();

  try {
    const result = await pool.query(
      `UPDATE events
       SET title = $1, description = $2, start_time = $3, end_time = $4, is_recurring = $5, recurrence_pattern = $6, priority = $7, updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [title, description, start_time, end_time, is_recurring, recurrence_pattern, priority, id]
    );
    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error updating event', details: error.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await pool.query('DELETE FROM events WHERE id = $1', [id]);
    return new Response(null, { status: 204 }); // No content response
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error deleting event', details: error.message }), { status: 500 });
  }
}
