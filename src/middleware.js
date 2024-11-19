// src/middleware.js

import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

export function middleware(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
  }

  // Add user info to the request headers so it can be accessed in the handler
  request.headers.set('user', JSON.stringify(payload));
  return NextResponse.next();
}

// Apply the middleware only to routes under /api/protected
export const config = {
  matcher: '/api/protected/:path*',
};
