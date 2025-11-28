import { SignJWT, jwtVerify } from 'jose';
import { compare } from 'bcryptjs';
import { AdminSession } from './types';

// JWT 密钥 - 生产环境必须设置 JWT_SECRET 环境变量
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

// 管理员密码哈希 - 使用 bcrypt 生成
// 默认密码 admin123 的 bcrypt hash（仅用于开发）
// 生产环境应设置 ADMIN_PASSWORD_HASH 环境变量
const DEFAULT_PASSWORD_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || DEFAULT_PASSWORD_HASH;

// Session 有效期
const SESSION_DURATION = '24h';

export class AuthService {
  /**
   * 验证管理员密码
   * 支持明文密码（环境变量 ADMIN_PASSWORD）或哈希密码（ADMIN_PASSWORD_HASH）
   */
  static async verifyPassword(password: string): Promise<boolean> {
    try {
      // 如果设置了 ADMIN_PASSWORD 环境变量（明文，用于简单部署）
      const plainPassword = process.env.ADMIN_PASSWORD;
      if (plainPassword) {
        return password === plainPassword;
      }

      // 使用 bcrypt 验证哈希密码
      return compare(password, ADMIN_PASSWORD_HASH);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  /**
   * 创建 JWT Session
   */
  static async createSession(): Promise<string> {
    const session: AdminSession = {
      isAuthenticated: true,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    const token = await new SignJWT({ ...session })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(SESSION_DURATION)
      .sign(JWT_SECRET);

    return token;
  }

  /**
   * 验证 JWT Session
   */
  static async verifySession(token: string): Promise<AdminSession | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      if (payload.isAuthenticated && payload.expiresAt) {
        return {
          isAuthenticated: payload.isAuthenticated as boolean,
          expiresAt: payload.expiresAt as number,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error verifying session:', error);
      return null;
    }
  }

  /**
   * 检查 session 是否有效
   */
  static isSessionValid(session: AdminSession | null): boolean {
    if (!session) return false;
    return session.isAuthenticated && session.expiresAt > Date.now();
  }

  /**
   * 从请求头获取并验证 Session
   */
  static async getSessionFromHeaders(headers: Headers): Promise<AdminSession | null> {
    const authHeader = headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // 兼容旧的 Session 格式
      if (authHeader?.startsWith('Session ')) {
        return this.parseLegacySession(authHeader.substring(8));
      }
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    return this.verifySession(token);
  }

  /**
   * 解析旧版 base64 Session（兼容性）
   * @deprecated 将在未来版本移除
   */
  private static parseLegacySession(sessionData: string): AdminSession | null {
    try {
      const session = JSON.parse(Buffer.from(sessionData, 'base64').toString('utf-8'));
      if (this.isSessionValid(session)) {
        return session;
      }
      return null;
    } catch {
      return null;
    }
  }
}
