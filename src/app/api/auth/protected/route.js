// src/app/api/protected/route.js
import { verifyToken } from '@/lib/jwt';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    return new Response(JSON.stringify({ message: 'Welcome, Admin!' }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Access denied: ${error.message}` }),
      { status: 401 }
    );
  }
}
