import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export function signToken(payload) {
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

export function verifyToken(token) {
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.verify(token, secret);
}
