# Deployment Guide - Inventory Tracker

## Architecture
This application consists of:
- **Frontend**: Astro static/hybrid site (port 4321)
- **Backend**: Express.js API server (port 3000)
- **Database**: PostgreSQL

## Prerequisites
- Node.js v18+
- PostgreSQL database (local or cloud)

## Environment Setup

### 1. Configure `.env` file
```
# Database (PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/inventory_tracker

# JWT Secret (generate a random string for production)
JWT_SECRET=change-this-to-random-string-in-production

# Frontend (Astro)
PORT=4321
NODE_ENV=development
PUBLIC_SITE_URL=http://localhost:4321

# Backend (Express)
EXPRESS_PORT=3000
CORS_ORIGIN=http://localhost:4321

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./public/uploads
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database

Create PostgreSQL database:
```bash
createdb inventory_tracker
```

Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

### 4. Start Development Servers

In separate terminals:

**Terminal 1 - Express Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Astro Frontend:**
```bash
npm run dev
```

Visit `http://localhost:4321` in your browser.

## 📝 Post-Setup Steps

### 1. Create First Admin User
- Go to: `http://localhost:4321/login`
- Click "Sign Up"
- Create your account

### 2. Test All Features
- ✓ Login/Register
- ✓ Add item with image upload
- ✓ View items on dashboard
- ✓ Borrow/Return items
- ✓ Search and filters
- ✓ Profile page

## 🔒 Security Checklist

### Generate Strong JWT Secret
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```
Update JWT_SECRET in `.env` with the generated value.

### PostgreSQL Connection Security
- Use strong passwords for database users
- For cloud databases, whitelist your server IP in firewall rules
- Use SSL connections for remote databases

### Never commit sensitive files
- `.env` is already in `.gitignore`
- Don't commit database credentials

## 🚀 Production Deployment

### Database Management
Use a managed PostgreSQL service:
- Cloud: AWS RDS, Azure Database, Google Cloud SQL, Railway, Render
- Local: Set up PostgreSQL server on your VPS

### Option 1: Deploy using Railway.app (Recommended)

1. **Sign Up**
   - Go to https://railway.app
   - Sign in with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL Database**
   - Click "Add Service"
   - Select "PostgreSQL"
   - Railway will provision a database

4. **Configure Environment**
   - Railway auto-sets `DATABASE_URL`
   - Add these variables:
     ```
     JWT_SECRET=your-strong-secret-key
     CORS_ORIGIN=https://your-domain.com
     EXPRESS_PORT=3000
     NODE_ENV=production
     PORT=4321
     PUBLIC_SITE_URL=https://your-domain.com
     ```

5. **Deploy**
   - Railway automatically deploys on git push
   - Get your app URL from Railway dashboard

### Option 2: Deploy to Render.com

1. **Create Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Database**
   - Click "New +"
   - Select "PostgreSQL"
   - Choose free tier

3. **Create Frontend Web Service**
   - Click "Deploy Web Service"
   - Connect your GitHub repo
   - Build Command: `npm run build`
   - Start Command: `npm run preview`
   - Environment Variables:
     ```
     PORT=4321
     NODE_ENV=production
     PUBLIC_SITE_URL=https://your-frontend-url.onrender.com
     PUBLIC_API_URL=https://your-backend-url.onrender.com
     ```

4. **Create Backend Web Service**
   - New Web Service
   - Build Command: `npm install`
   - Start Command: `npm run start`
   - Environment Variables:
     ```
     DATABASE_URL=<from PostgreSQL service>
     JWT_SECRET=your-strong-secret-key
     EXPRESS_PORT=3000
     CORS_ORIGIN=https://your-frontend-url.onrender.com
     NODE_ENV=production
     ```

### Option 3: Deploy to Your Own Server

1. **SSH into Server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Dependencies**
   - Node.js v18+
   - PostgreSQL
   - Git

3. **Clone & Setup**
   ```bash
   git clone <your-repo-url>
   cd Inventory-Tracker
   npm install
   npx prisma migrate deploy
   ```

4. **Setup Environment**
   - Create `.env` with production values

5. **Run with PM2**
   ```bash
   npm install -g pm2

   # For Express backend
   pm2 start "npm run dev:server" --name inventory-api

   # For Astro frontend (if using preview/production build)
   npm run build
   pm2 start "npm run preview" --name inventory-frontend

   pm2 save
   pm2 startup
   ```

6. **Setup Reverse Proxy (Nginx)**
   ```nginx
   # Frontend
   server {
     listen 80;
     server_name your-domain.com;
     location / {
       proxy_pass http://localhost:4321;
     }
   }

   # Backend
   server {
     listen 80;
     server_name api.your-domain.com;
     location / {
       proxy_pass http://localhost:3000;
     }
   }
   ```

## 🔄 Updating Your Deployment

When you make changes:

```bash
# 1. Commit changes
git add .
git commit -m "description of changes"
git push origin main

# 2. Platform auto-deploys (Railway/Render)
# OR manual redeploy on VPS:
cd ~/Inventory-Tracker
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 restart inventory-api inventory-frontend
```

## 🐛 Troubleshooting

### Database Connection Error
- Verify DATABASE_URL in .env
- Check PostgreSQL is running
- Confirm database credentials are correct
- For cloud databases, check firewall/network access

### CORS Errors
- Verify CORS_ORIGIN matches frontend URL
- Frontend and backend must be on same origin or CORS properly configured

### Build Fails
- Check Node.js version (v18+)
- Verify all dependencies: `npm install`
- Run build locally first: `npm run build`

### Images Not Loading
- Check `/public/uploads` directory exists
- Verify write permissions
- Consider using cloud storage (AWS S3, Cloudinary) for production

### Prisma Issues
- Run migrations: `npx prisma migrate deploy`
- Check DATABASE_URL is valid
- Reset database (dev only): `npx prisma migrate reset`

## 📊 Monitoring

For production, consider:
- **Uptime Monitoring**: UptimeRobot (free)
- **Error Tracking**: Sentry
- **Analytics**: Plausible or Fathom (privacy-friendly)
- **Logs**: Use platform logging (Railway, Render)

## 🎉 You're Ready!

Your Inventory Tracker is now live and ready for users!

**Quick Start for New Users:**
1. Go to your app URL
2. Click "Sign Up"
3. Create account
4. Start adding inventory items!

