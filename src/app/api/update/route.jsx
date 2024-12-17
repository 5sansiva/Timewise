import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
   user: 'postgres',
   host: 'localhost',
   database: 'timewise_db',
   password: 'Postgres.2004',
   port: 5432,
});

// Function to get user data
export async function GET(request) {
 try {
   // Query to get the user with the highest (most recent) ID
   const result = await pool.query(
     'SELECT * FROM users ORDER BY id DESC LIMIT 1'
   );

   if (result.rows.length === 0) {
     return NextResponse.json(
       { error: 'User not found' },
       { status: 404 }
     );
   }

   return NextResponse.json(result.rows[0]);
 } catch (error) {
   console.error('Error fetching user:', error);
   return NextResponse.json(
     { error: 'Failed to fetch user' },
     { status: 500 }
   );
 }
}

// Function to update user data
export async function PUT(request) {
 try {
   const data = await request.json();
   console.log('Updating with data:', data);

   // If it's a password update
   if (data.type === 'password') {
     const result = await pool.query(
       `UPDATE users 
        SET password = $1
        WHERE id = $2 
        RETURNING *`,
       [data.newPassword, data.id]
     );

     if (result.rows.length === 0) {
       return NextResponse.json(
         { error: 'User not found' },
         { status: 404 }
       );
     }

     return NextResponse.json({ 
       message: 'Password updated successfully'
     });
   }

   // If it's a profile update
   const result = await pool.query(
     `UPDATE users 
      SET first_name = $1, 
          last_name = $2, 
          email = $3 
      WHERE id = $4 
      RETURNING *`,
     [data.firstName, data.lastName, data.email, data.id]
   );

   console.log('Update result:', result.rows[0]);

   if (result.rows.length === 0) {
     return NextResponse.json(
       { error: 'User not found' },
       { status: 404 }
     );
   }

   return NextResponse.json({ 
     message: 'Profile updated successfully',
     user: result.rows[0]
   });

 } catch (error) {
   console.error('Detailed error:', error);
   return NextResponse.json(
     { error: 'Failed to update profile', details: error.message },
     { status: 500 }
   );
 }
}

export async function DELETE(request) {
  try {
    const data = await request.json();
    console.log('Deleting account with ID:', data.id);

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [data.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account', details: error.message },
      { status: 500 }
    );
  }
}