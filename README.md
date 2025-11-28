# EyeSeas Navigation 🧭

一个现代化的内外网导航管理系统，支持分类管理、标签筛选、内外网切换等功能。

![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)

## ✨ 功能特性

- 🔗 **导航链接管理** - 添加、编辑、删除导航链接
- 📁 **分类管理** - 创建分类，支持拖拽排序
- 🏷️ **标签系统** - 为链接添加标签，快速筛选
- 🌐 **内外网切换** - 一键切换内网/外网地址
- 🔍 **实时搜索** - 防抖搜索，即时响应
- 🌙 **深色模式** - 自动跟随系统或手动切换
- 📱 **响应式设计** - 完美适配移动端
- 🔐 **JWT 认证** - 安全的管理后台访问

## 🚀 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 14+
- pnpm（推荐）

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/your-username/eyeseas-nav.git
cd eyeseas-nav
```

2. **安装依赖**

```bash
pnpm install
```

3. **配置环境变量**

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入数据库连接和密码：

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/eyeseas_nav
JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars
ADMIN_PASSWORD=your-admin-password
```

4. **初始化数据库**

```bash
pnpm db:push
```

5. **启动开发服务器**

```bash
pnpm dev
```

访问 http://localhost:3000 查看应用。

## 📦 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 前端 | React 19, TypeScript |
| 样式 | Tailwind CSS 4, Framer Motion |
| UI 组件 | HeroUI, Radix UI |
| 数据库 | PostgreSQL, Drizzle ORM |
| 认证 | JWT (jose) |
| 状态管理 | SWR |
| 表单 | React Hook Form, Zod |

## 🔧 环境变量

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `DATABASE_URL` | ✅ | PostgreSQL 连接字符串 |
| `JWT_SECRET` | ✅ | JWT 签名密钥（至少 32 字符） |
| `ADMIN_PASSWORD` | ⚠️ | 管理员明文密码（二选一） |
| `ADMIN_PASSWORD_HASH` | ⚠️ | 管理员 bcrypt 哈希密码（二选一） |
| `NEXT_PUBLIC_APP_TITLE` | ❌ | 应用标题 |
| `NEXT_PUBLIC_APP_DESCRIPTION` | ❌ | 应用描述 |

### 生成安全密钥

```bash
# 生成 JWT 密钥
openssl rand -base64 32

# 生成密码哈希
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

## 📁 项目结构

```
eyeseas-nav/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── auth/          # 认证接口
│   │   ├── links/         # 链接 CRUD
│   │   ├── categories/    # 分类 CRUD
│   │   └── stats/         # 统计接口
│   ├── admin/             # 管理后台页面
│   ├── login/             # 登录页面
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── admin/             # 后台组件
│   └── ui/                # UI 组件
├── lib/                   # 工具库
│   ├── auth.ts            # 认证服务
│   ├── api-client.ts      # API 客户端
│   ├── api-response.ts    # 统一响应
│   ├── contexts/          # React Context
│   ├── hooks/             # 自定义 Hooks
│   ├── db/                # 数据库层
│   │   ├── schema.ts      # Drizzle Schema
│   │   └── repositories/  # 数据仓库
│   └── validations.ts     # Zod 验证
└── public/                # 静态资源
```

## 🛠️ 开发命令

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 数据库推送（同步 Schema）
pnpm db:push
```

## 🚢 部署

### Vercel（推荐）

1. 将项目推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署

### Docker

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t eyeseas-nav .
docker run -p 3000:3000 --env-file .env.production eyeseas-nav
```

### 传统服务器

```bash
# 构建
pnpm build

# 启动（推荐使用 PM2）
pm2 start npm --name "eyeseas-nav" -- start
```

## 📄 API 文档

### 认证

所有管理接口需要在 Header 中携带 JWT：

```
Authorization: Bearer <token>
```

### 接口列表

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/login` | 管理员登录 | ❌ |
| GET | `/api/auth/verify` | 验证 Session | ✅ |
| GET | `/api/links` | 获取所有链接 | ❌ |
| POST | `/api/links` | 创建链接 | ✅ |
| PUT | `/api/links/[id]` | 更新链接 | ✅ |
| DELETE | `/api/links/[id]` | 删除链接 | ✅ |
| GET | `/api/categories` | 获取所有分类 | ❌ |
| POST | `/api/categories` | 创建分类 | ✅ |
| PUT | `/api/categories/[id]` | 更新分类 | ✅ |
| DELETE | `/api/categories/[id]` | 删除分类 | ✅ |
| GET | `/api/stats` | 获取统计数据 | ❌ |

### 响应格式

```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

## 🔒 安全建议

1. **生产环境** 必须设置强密码和随机 JWT 密钥
2. **使用 HTTPS** 保护数据传输
3. **定期轮换** JWT 密钥和管理员密码
4. **限制访问** 仅允许信任的 IP 访问管理后台
5. **数据库安全** 使用强密码，启用 SSL 连接

## 📝 更新日志

### v1.0.0 (2025-11)

- ✨ 初始版本发布
- 🔐 JWT 认证系统
- 📁 分类和标签管理
- 🌐 内外网切换功能
- 🎨 响应式 UI 设计

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

Made with ❤️ by EyeSeas Team

