# Nacare Clinic - Deployment Guide

## Deploying to Vercel (Recommended)

Vercel is the easiest platform to deploy Next.js applications.

### Prerequisites
- GitHub account
- Vercel account (free): https://vercel.com/signup
- MongoDB Atlas account with connection string

### Steps

1. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   
   Add these in Vercel project settings:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_strong_random_secret_key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a URL like: `https://nacare-clinic.vercel.app`

5. **Seed the Production Database**
   
   After first deployment:
   - Update `scripts/seed.js` with production MONGODB_URI
   - Run locally: `node scripts/seed.js`
   - Or create an API endpoint to seed

### Post-Deployment Checklist

- [ ] Test login with admin credentials
- [ ] Change admin password
- [ ] Create staff users
- [ ] Test patient registration
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring

## Alternative: Deploy to Other Platforms

### Railway

1. Create account at https://railway.app
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy

### Render

1. Create account at https://render.com
2. New Web Service → Connect repository
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add environment variables

### DigitalOcean App Platform

1. Create account at https://www.digitalocean.com
2. App Platform → Create App
3. Connect GitHub repository
4. Configure environment variables
5. Deploy

## Self-Hosted Deployment

### Using PM2 (Production Server)

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```

3. **Start with PM2**
   ```bash
   pm2 start npm --name "nacare-clinic" -- start
   pm2 save
   pm2 startup
   ```

### Using Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t nacare-clinic .
docker run -p 3000:3000 --env-file .env.local nacare-clinic
```

## Security Considerations for Production

### 1. Environment Variables
- Use strong, random JWT_SECRET
- Never commit .env files to version control
- Use platform-specific secret management

### 2. MongoDB Security
- Use strong database passwords
- Whitelist only necessary IP addresses
- Enable MongoDB authentication
- Regular backups

### 3. Application Security
- Change default admin password immediately
- Implement rate limiting
- Add HTTPS (handled by Vercel/platforms)
- Regular security updates

### 4. Monitoring & Logging
- Set up error tracking (Sentry, LogRocket)
- Monitor application performance
- Database monitoring
- Set up alerts for critical errors

## Backup Strategy

### Database Backups
1. MongoDB Atlas has automatic backups
2. Or use mongodump:
   ```bash
   mongodump --uri="your_connection_string"
   ```

### Code Backups
- Version control with Git
- Multiple remote repositories
- Regular commits

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate auto-generated

### Other Platforms
- Follow platform-specific domain setup
- Update NEXT_PUBLIC_APP_URL in environment variables

## Maintenance

### Regular Tasks
- [ ] Weekly: Check application logs
- [ ] Monthly: Review user accounts
- [ ] Monthly: Database cleanup if needed
- [ ] Quarterly: Security audit
- [ ] Quarterly: Dependency updates

### Updating the Application

```bash
git pull origin main
npm install
npm run build
pm2 restart nacare-clinic  # if using PM2
```

Or redeploy on Vercel (automatic with GitHub integration)

## Support

For deployment issues:
- Check platform-specific documentation
- Review application logs
- Verify environment variables
- Test MongoDB connection

---

**Ready to deploy? Choose your platform and follow the steps above!**
