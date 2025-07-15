import { AdminSession } from './types';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export class AuthService {
  // Verify admin password
  static async verifyPassword(password: string): Promise<boolean> {
    try {
      // Simple password verification
      return password === ADMIN_PASSWORD;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // Create a simple session
  static createSession(): AdminSession {
    return {
      isAuthenticated: true,
      expiresAt: Date.now() + SESSION_DURATION,
    };
  }

  // Check if session is valid
  static isSessionValid(session: AdminSession | null): boolean {
    if (!session) return false;
    return session.isAuthenticated && session.expiresAt > Date.now();
  }

  // Get session from request headers
  static getSessionFromHeaders(headers: Headers): AdminSession | null {
    const authHeader = headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Session ')) {
      return null;
    }

    try {
      const sessionData = authHeader.substring(8); // Remove 'Session ' prefix
      const session = JSON.parse(Buffer.from(sessionData, 'base64').toString('utf-8'));

      if (this.isSessionValid(session)) {
        return session;
      }

      return null;
    } catch (error) {
      console.error('Error parsing session:', error);
      return null;
    }
  }
}
