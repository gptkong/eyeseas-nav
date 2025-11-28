import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// 全局变量类型声明
const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
};

// 数据库连接配置
const connectionString = process.env.DATABASE_URL!;

// 创建或复用连接
// 在开发环境缓存连接，避免热重载时创建过多连接
const client = globalForDb.client ?? postgres(connectionString, {
  max: 10,                    // 最大连接数
  idle_timeout: 20,           // 空闲连接超时（秒）
  connect_timeout: 10,        // 连接超时（秒）
  prepare: false,             // 禁用预编译语句（Serverless 环境推荐）
});

// 开发环境缓存连接
if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client;
}

// 导出 Drizzle ORM 实例
export const db = drizzle(client, { schema });

// 导出原始客户端（用于需要直接执行 SQL 的场景）
export { client };
