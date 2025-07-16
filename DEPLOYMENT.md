# ENav - 部署指南

本指南将帮助您将 ENav 应用程序部署到 Vercel 并配置 Redis 数据库。

## 前置要求

1. **Vercel 账户**：在 [vercel.com](https://vercel.com) 注册账户
2. **GitHub 仓库**：将您的代码推送到 GitHub 仓库
3. **Redis 数据库**：Redis Cloud 账户或任何 Redis 提供商
4. **Vercel CLI**（可选）：使用 `npm i -g vercel` 安装

## 步骤 1：设置 Redis 数据库

### 选项 A：Redis Cloud（推荐）

1. 访问 [Redis Cloud](https://redis.com/try-free/)
2. 注册免费账户
3. 创建新数据库
4. 选择您偏好的区域
5. 获取 Redis 连接 URL，格式如下：
   ```
   redis://default:password@host:port
   ```

### 选项 B：其他 Redis 提供商

您可以使用任何 Redis 提供商，例如：
- Upstash Redis
- AWS ElastiCache
- Railway Redis
- 自托管 Redis

## 步骤 2：部署到 Vercel

### 选项 A：通过 Vercel 控制台部署（推荐）

1. 访问 [Vercel 控制台](https://vercel.com/dashboard)
2. 点击"New Project"
3. 导入您的 GitHub 仓库
4. Vercel 将自动检测这是一个 Next.js 项目
5. 配置环境变量（参见步骤 3）
6. 点击"Deploy"

### 选项 B：通过 Vercel CLI 部署

1. 安装 Vercel CLI：`npm i -g vercel`
2. 登录：`vercel login`
3. 在项目目录中：`vercel`
4. 按照提示链接您的项目
5. 通过控制台配置环境变量

## 步骤 3：配置环境变量

在您的 Vercel 项目控制台中，转到 Settings > Environment Variables 并添加：

### 必需变量

| 变量 | 值 | 描述 |
|----------|-------|-------------|
| `REDIS_URL` | `redis://default:password@host:port` | 来自您的 Redis 提供商 |
| `ADMIN_PASSWORD` | `your_secure_password` | 选择一个强密码 |

### 可选变量

| 变量 | 值 | 描述 |
|----------|-------|-------------|
| `NEXT_PUBLIC_APP_NAME` | `ENav` | 应用名称（已设置） |
| `NEXT_PUBLIC_APP_DESCRIPTION` | `内外网导航仪表板` | 应用描述（已设置） |

## 步骤 4：验证部署

1. 等待部署完成
2. 访问您的部署 URL
3. 测试导航仪表板
4. 访问 `/admin` 并测试管理员登录
5. 创建一些测试导航链接

## 步骤 5：域名配置（可选）

1. 在 Vercel 控制台中，转到您的项目
2. 导航到 Settings > Domains
3. 添加您的自定义域名
4. 按照 DNS 配置说明操作

## 故障排除

### 常见问题

1. **环境变量不工作**
   - 确保所有必需变量都已设置
   - 添加变量后重新部署
   - 检查变量名称是否完全匹配

2. **Redis 数据库连接问题**
   - 验证 REDIS_URL 是否正确且可访问
   - 检查 Redis 数据库是否正在运行并接受连接
   - 确保 Redis 凭据有效

3. **管理员登录不工作**
   - 检查 ADMIN_PASSWORD 环境变量
   - 验证 JWT_SECRET 是否已设置
   - 清除浏览器缓存并重试

4. **构建失败**
   - 检查 Vercel 控制台中的构建日志
   - 确保所有依赖项都在 package.json 中
   - 验证 TypeScript 类型是否正确

### 获取帮助

- 检查 Vercel 部署日志
- 查看浏览器控制台错误
- 确保所有 API 路由正常工作

## 安全考虑

1. **强管理员密码**：为管理员访问使用复杂密码
2. **环境变量**：永远不要将敏感数据提交到您的仓库
3. **HTTPS**：Vercel 默认提供 HTTPS
4. **定期更新**：保持依赖项更新

## 备份和维护

1. **数据备份**：Redis Cloud 提供自动备份（检查您的提供商的备份选项）
2. **监控**：使用 Vercel Analytics 监控性能
3. **更新**：定期更新依赖项并重新部署

## 后续步骤

成功部署后：

1. 通过管理面板添加您的第一个导航链接
2. 根据需要自定义应用名称和描述
3. 设置监控和分析
4. 考虑添加更多主题或自定义功能
5. 培训用户如何使用导航仪表板

## 支持

对于此应用程序的特定问题，请查看 README.md 文件或在仓库中创建问题。

对于 Vercel 特定问题，请参考 [Vercel 文档](https://vercel.com/docs)。
