import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  ADMIN_PASSWORD: z.string().min(8, '管理员密码至少需要8个字符'),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  NODE_ENV: process.env.NODE_ENV,
});
