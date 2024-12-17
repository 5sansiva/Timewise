import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await pool.query('SELECT NOW()');
    return NextResponse.json({ success: true, timestamp: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    const query = `
      INSERT INTO public.users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email
    `;

    const result = await pool.query(query, [firstName, lastName, email, password]);

    return NextResponse.json({
      success: true,
      user: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    if (error.code === '23505') { // Unique violation error code
      return NextResponse.json({
        error: 'Email already exists'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: 'Failed to create user'
    }, { status: 500 });
  }
}