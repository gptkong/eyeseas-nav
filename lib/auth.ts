import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminSession } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export class AuthService {
  // Verify admin password
  static async verifyPassword(password: string): Promise<boolean> {
    try {
      // For simplicity, we're using plain text comparison
      // In production, you should hash the admin password
      return password === ADMIN_PASSWORD;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // Generate JWT token
  static generateToken(): string {
    const payload = {
      isAdmin: true,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    };

    return jwt.sign(payload, JWT_SECRET);
  }

  // Verify JWT token
  static verifyToken(token: string): AdminSession | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      if (decoded.isAdmin && decoded.exp > Math.floor(Date.now() / 1000)) {
        return {
          isAuthenticated: true,
          expiresAt: decoded.exp * 1000, // Convert to milliseconds
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  // Check if session is valid
  static isSessionValid(session: AdminSession | null): boolean {
    if (!session) return false;
    return session.isAuthenticated && session.expiresAt > Date.now();
  }

  // Get session from request headers
  static getSessionFromHeaders(headers: Headers): AdminSession | null {
    const authHeader = headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    return this.verifyToken(token);
  }
}
