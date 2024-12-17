import pool from "../../../../lib/db";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log('Received login attempt:', { email });

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [trimmedEmail]
    );

    if (result.rows.length === 0) {
      console.log('No user found with this email');
      return NextResponse.json(
        { message: 'No user found with this email' }, 
        { status: 401 }
      );
    }

    const user = result.rows[0];

    if (user.password !== trimmedPassword) {
      console.log('Password mismatch');
      return NextResponse.json(
        { message: 'Invalid password' }, 
        { status: 401 }
      );
    }

    console.log('Login successful');
    return NextResponse.json(
      { message: 'Login successful', userId: user.id }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Detailed login error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message }, 
      { status: 500 }
    );
  }
}