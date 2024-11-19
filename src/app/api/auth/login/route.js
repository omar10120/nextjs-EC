// src/app/api/auth/login/route.js
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { signToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Find user in database
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    // Generate token with role
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role, // Include role in the token payload
    });

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, role: user.role },
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Login failed: ${error.message}` }),
      { status: 500 }
    );
  }
}
