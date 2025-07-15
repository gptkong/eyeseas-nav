# EyeSeas Navigation - Deployment Guide

This guide will help you deploy the EyeSeas Navigation application to Vercel with Redis database.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to a GitHub repository
3. **Redis Database**: Redis Cloud account or any Redis provider
4. **Vercel CLI** (optional): Install with `npm i -g vercel`

## Step 1: Set Up Redis Database

### Option A: Redis Cloud (Recommended)

1. Go to [Redis Cloud](https://redis.com/try-free/)
2. Sign up for a free account
3. Create a new database
4. Choose your preferred region
5. Get your Redis connection URL in the format:
   ```
   redis://default:password@host:port
   ```

### Option B: Other Redis Providers

You can use any Redis provider like:
- Upstash Redis
- AWS ElastiCache
- Railway Redis
- Self-hosted Redis

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project
5. Configure environment variables (see Step 3)
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. In your project directory: `vercel`
4. Follow the prompts to link your project
5. Configure environment variables via dashboard

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to Settings > Environment Variables and add:

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `REDIS_URL` | `redis://default:password@host:port` | From your Redis provider |
| `ADMIN_PASSWORD` | `your_secure_password` | Choose a strong password |

### Optional Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_APP_NAME` | `EyeSeas Navigation` | App name (already set) |
| `NEXT_PUBLIC_APP_DESCRIPTION` | `Internal and External Navigation Dashboard` | App description (already set) |

## Step 4: Verify Deployment

1. Wait for deployment to complete
2. Visit your deployed URL
3. Test the navigation dashboard
4. Go to `/admin` and test admin login
5. Create a few test navigation links

## Step 5: Domain Configuration (Optional)

1. In Vercel Dashboard, go to your project
2. Navigate to Settings > Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   - Ensure all required variables are set
   - Redeploy after adding variables
   - Check variable names match exactly

2. **Redis Database Connection Issues**
   - Verify REDIS_URL is correct and accessible
   - Check Redis database is running and accepting connections
   - Ensure Redis credentials are valid

3. **Admin Login Not Working**
   - Check ADMIN_PASSWORD environment variable
   - Verify JWT_SECRET is set
   - Clear browser cache and try again

4. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify TypeScript types are correct

### Getting Help

- Check Vercel deployment logs
- Review browser console for errors
- Ensure all API routes are working correctly

## Security Considerations

1. **Strong Admin Password**: Use a complex password for admin access
2. **Environment Variables**: Never commit sensitive data to your repository
3. **HTTPS**: Vercel provides HTTPS by default
4. **Regular Updates**: Keep dependencies updated

## Backup and Maintenance

1. **Data Backup**: Redis Cloud provides automatic backups (check your provider's backup options)
2. **Monitoring**: Use Vercel Analytics to monitor performance
3. **Updates**: Regularly update dependencies and redeploy

## Next Steps

After successful deployment:

1. Add your first navigation links via the admin panel
2. Customize the app name and description if needed
3. Set up monitoring and analytics
4. Consider adding more themes or customizations
5. Train users on how to use the navigation dashboard

## Support

For issues specific to this application, check the README.md file or create an issue in the repository.

For Vercel-specific issues, consult the [Vercel Documentation](https://vercel.com/docs).
