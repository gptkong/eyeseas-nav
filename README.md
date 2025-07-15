# EyeSeas Navigation

A responsive web service navigation dashboard built with Next.js, DaisyUI, and Redis. This application provides an organized way to manage and access internal and external navigation links with a clean admin interface.

## Features

### Frontend Dashboard
- 🎨 **Responsive Design**: Built with DaisyUI/Tailwind CSS for mobile-first design
- 🔄 **Category Toggle**: Switch between Internal and External network links
- 🔍 **Search & Filter**: Easy link discovery with real-time search
- 📊 **Statistics**: Dashboard showing link counts and categories
- 📱 **Mobile Responsive**: Works seamlessly across all device sizes

### Admin Panel
- 🔐 **Secure Authentication**: Password-protected admin access
- ✏️ **CRUD Operations**: Create, Read, Update, Delete navigation links
- ✅ **Form Validation**: Comprehensive validation using Zod
- 🎯 **Link Management**: Organize links with categories, descriptions, and icons
- 🔧 **Status Control**: Enable/disable links without deletion

### Technical Features
- 🚀 **Next.js 15**: Latest Next.js with App Router
- 🗄️ **Redis Database**: Fast, reliable data persistence
- 🔒 **JWT Authentication**: Secure session management
- 📡 **API Routes**: RESTful API for all operations
- 🎨 **DaisyUI Components**: Beautiful, accessible UI components
- 📱 **Responsive Grid**: Adaptive layout for all screen sizes

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **Database**: Redis (Redis Cloud compatible)
- **Authentication**: Simple session-based authentication
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- Redis database (Redis Cloud, Upstash, or local Redis)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd eyeseas-nav
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:
   ```env
   REDIS_URL=redis://default:your_password@your-redis-host:port
   ADMIN_PASSWORD=your_secure_admin_password
   ```

4. **Test Redis connection**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000/api/test-redis` to verify Redis connectivity

6. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application

## Usage

### User Dashboard
- Visit the main page to view all navigation links
- Use the search bar to find specific links
- Toggle between Internal/External categories
- Click any link card to open the destination

### Admin Panel
- Go to `/admin` to access the admin panel
- Login with your admin password
- Add, edit, or delete navigation links
- Toggle link status (active/inactive)
- View dashboard statistics

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REDIS_URL` | Redis connection string | Yes |
| `ADMIN_PASSWORD` | Admin panel password | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |
| `NEXT_PUBLIC_APP_DESCRIPTION` | App description | No |

## API Endpoints

### Public Endpoints
- `GET /api/links` - Get all navigation links
- `GET /api/links/[id]` - Get single navigation link
- `GET /api/stats` - Get dashboard statistics

### Admin Endpoints (Authentication Required)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify session
- `POST /api/links` - Create navigation link
- `PUT /api/links/[id]` - Update navigation link
- `DELETE /api/links/[id]` - Delete navigation link

## Development

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   └── ...               # Shared components
├── lib/                  # Utilities and configurations
│   ├── hooks/            # Custom React hooks
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database service
│   ├── types.ts          # TypeScript types
│   └── validations.ts    # Zod schemas
└── public/               # Static assets
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up Redis database (Redis Cloud recommended)
4. Configure environment variables in Vercel dashboard
5. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
- Review the API documentation above
- Create an issue in the repository

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [DaisyUI](https://daisyui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Deployed on [Vercel](https://vercel.com/)
