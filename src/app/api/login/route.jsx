import pool from "../../../../lib/db";
import { NextResponse } from 'next/server';
//import bcrypt from 'bcrypt'; 

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log('Received login attempt:', { email, password });

    // Trim inputs to remove any accidental whitespace
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Query the database for the user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [trimmedEmail]
    );
    console.log('Database query result:', result.rows);

    if (result.rows.length === 0) {
      console.log('No user found with this email');
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const user = result.rows[0];
    console.log('User found:', { ...user, password: '[REDACTED]' });

    // Directly compare the provided password with the stored password
    if (user.password !== trimmedPassword) {
      console.log('Password mismatch');
      console.log('Stored password length:', user.password.length);
      console.log('Provided password length:', trimmedPassword.length);
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    console.log('Login successful');
    return NextResponse.json({ message: 'Login successful', userId: user.id }, { status: 200 });

  } catch (error) {
    console.error('Detailed login error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}