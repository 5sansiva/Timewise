// src/app/api/events/route.js
import pool from '../../../../lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY start_time ASC');
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching events', details: error.message }), { status: 500 });
  }
}
