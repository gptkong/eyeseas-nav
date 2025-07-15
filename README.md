# EyeSeas Navigation
一个使用 Next.js、DaisyUI 和 Redis 构建的响应式 Web 服务导航仪表盘。该应用程序提供了一种组织良好的方式来管理和访问内部和外部导航链接，并具备整洁的管理界面。
## 功能
### 前端仪表盘
- 🎨 **响应式设计**：使用 DaisyUI/Tailwind CSS 构建，适合移动设备优先设计
- 🔄 **分类切换**：在内部和外部网络链接之间切换
- 🔍 **搜索 & 筛选**：实时搜索，轻松发现链接
- 📊 **统计数据**：仪表盘显示链接数量和类别
- 📱 **移动响应**：在所有设备尺寸下无缝工作
### 管理面板
- 🔐 **安全认证**：密码保护的管理员访问
- ✏️ **CRUD 操作**：创建、读取、更新、删除导航链接
- ✅ **表单验证**：使用 Zod 进行全面验证
- 🎯 **链接管理**：用类别、描述和图标组织链接
- 🔧 **状态控制**：启用/禁用链接而不删除
### 技术特性
- 🚀 **Next.js 15**：最新 Next.js 搭配应用路由
- 🗄️ **Redis 数据库**：快速、可靠的数据持久化
- 🔒 **JWT 认证**：安全的会话管理
- 📡 **API 路由**：所有操作的 RESTful API
- 🎨 **DaisyUI 组件**：美观、可访问的 UI 组件
- 📱 **响应式网格**：适应所有屏幕尺寸的布局
## 技术栈
- **前端**：Next.js 15, React 19, TypeScript
- **样式**：Tailwind CSS, DaisyUI
- **数据库**：Redis（兼容 Redis Cloud）
- **认证**：简单的基于会话的认证
- **表单**：React Hook Form 与 Zod 验证
- **图标**：Lucide React
- **部署**：Vercel
## 快速开始
### 先决条件
- Node.js 18+
- Redis 数据库（Redis Cloud、Upstash 或本地 Redis）
- Git
### 安装
1. **克隆仓库**
   ```bash
   git clone <your-repo-url>
   cd eyeseas-nav
   ```
2. **安装依赖**
   ```bash
   npm install
   ```
3. **设置环境变量**
   ```bash
   cp .env.example .env.local
   ```
   使用您的配置编辑 `.env.local`：
   ```env
   REDIS_URL=redis://default:your_password@your-redis-host:port
   ADMIN_PASSWORD=your_secure_admin_password
   ```
4. **测试 Redis 连接**
   ```bash
   npm run dev
   ```
   访问 `http://localhost:3000/api/test-redis` 验证 Redis 连通性
6. **启动开发服务器**
   ```bash
   npm run dev
   ```
   打开 [http://localhost:3000](http://localhost:3000) 查看应用程序
## 使用
### 用户仪表盘
- 访问主页查看所有导航链接
- 使用搜索栏查找特定链接
- 在内部/外部类别间切换
- 点击任意链接卡片打开链接目标
### 管理面板
- 转到 `/admin` 访问管理面板
- 使用管理员密码登录
- 添加、编辑或删除导航链接
- 切换链接状态（激活/非激活）
- 查看仪表盘统计数据
## 环境变量
| 变量 | 描述 | 必需 |
|------|------|------|
| `REDIS_URL` | Redis 连接字符串 | 是 |
| `ADMIN_PASSWORD` | 管理面板密码 | 是 |
| `NEXT_PUBLIC_APP_NAME` | 应用程序名称 | 否 |
| `NEXT_PUBLIC_APP_DESCRIPTION` | 应用描述 | 否 |
## API 端点
### 公共端点
- `GET /api/links` - 获取所有导航链接
- `GET /api/links/[id]` - 获取单个导航链接
- `GET /api/stats` - 获取仪表盘统计
### 管理端点（需要认证）
- `POST /api/auth/login` - 管理员登录
- `GET /api/auth/verify` - 验证会话
- `POST /api/links` - 创建导航链接
- `PUT /api/links/[id]` - 更新导航链接
- `DELETE /api/links/[id]` - 删除导航链接
## 开发
### 项目结构
```
├── app/                   # Next.js 应用路由
│   ├── api/               # API 路由
│   ├── admin/             # 管理页面
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── admin/             # 管理特定组件
│   └── ...               # 共享组件
├── lib/                  # 工具和配置
│   ├── hooks/            # 自定义 React hooks
│   ├── auth.ts           # 认证工具
│   ├── db.ts             # 数据库服务
│   ├── types.ts          # TypeScript 类型
│   └── validations.ts    # Zod 模型
└── public/               # 静态资源
```
### 可用脚本
- `npm run dev` - 启动开发服务器
- `npm run build` - 制作生产构建
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint
## 部署
请参见 [DEPLOYMENT.md](./DEPLOYMENT.md) 以获取详细的 Vercel 部署说明。
### 快速部署到 Vercel
1. 将代码推送到 GitHub
2. 将您的仓库连接到 Vercel
3. 设置 Redis 数据库（推荐 Redis Cloud）
4. 在 Vercel 仪表盘配置环境变量
5. 部署！
## 贡献
1. Fork 该仓库
2. 创建一个功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request
## 许可证
此项目根据 MIT 许可证授权—更多信息请查看 [LICENSE](LICENSE) 文件。
## 支持
如需支持与问题：
- 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 指南
- 回顾上面的 API 文档
- 在仓库中创建一个问题
## 致谢
- 使用 [Next.js](https://nextjs.org/) 构建
- 使用 [DaisyUI](https://daisyui.com/) 进行样式设计
- 图标来自 [Lucide](https://lucide.dev/)
- 部署于 [Vercel](https://vercel.com/)