import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

export function generateToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role,
      fullName: user.fullName
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getUserFromRequest(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

export function requireAuth(handler) {
  return async (request, context) => {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    request.user = user;
    return handler(request, context);
  };
}

export function requireRole(roles) {
  return (handler) => {
    return async (request, context) => {
      const user = getUserFromRequest(request);
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      if (!roles.includes(user.role)) {
        return new Response(
          JSON.stringify({ error: 'Forbidden: Insufficient permissions' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      request.user = user;
      return handler(request, context);
    };
  };
}
