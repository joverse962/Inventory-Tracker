# Deployment Guide - Inventory Tracker

## 🚀 Quick Deployment Steps

### Option 1: Deploy to Render.com (Recommended - FREE)

**Render.com** offers free hosting perfect for this application.

#### Steps:

1. **Prepare Your Code**
   ```powershell
   # Make sure everything is committed
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Sign Up & Connect**
   - Go to https://render.com
   - Sign up with your GitHub account
   - Click "New +" → "Web Service"
   - Connect your `Inventory-Tracker` repository

3. **Configure Web Service**
   - **Name**: `inventory-tracker` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node ./dist/server/entry.mjs`
   - **Instance Type**: `Free`

4. **Add Environment Variables** (in Render dashboard)
   ```
   MONGODB_URI=mongodb+srv://modat_db_user:esuaBfNJfnwalp22@cluster0.pxizqba.mongodb.net/inventory-tracker?retryWrites=true&w=majority
   JWT_SECRET=change-this-to-random-string-in-production
   PORT=10000
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - Your app will be live at: `https://inventory-tracker-XXXX.onrender.com`

---

### Option 2: Deploy to Railway.app (Also FREE)

1. **Sign Up**
   - Go to https://railway.app
   - Sign in with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**
   - Railway auto-detects Node.js
   - Add environment variables in "Variables" tab:
     ```
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_secret_key
     ```

4. **Deploy**
   - Railway automatically deploys
   - You'll get a URL like: `https://inventory-tracker-production-XXXX.railway.app`

---

### Option 3: Deploy to Vercel

1. **Install Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

2. **Login & Deploy**
   ```powershell
   vercel login
   vercel --prod
   ```

3. **Add Environment Variables**
   - Go to Vercel dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `.env` file

---

### Option 4: Deploy to Your Own Server (VPS)

If you have a server (DigitalOcean, AWS, etc.):

1. **SSH into your server**
2. **Install Node.js** (v18 or higher)
3. **Clone repository**
   ```bash
   git clone https://github.com/your-username/Inventory-Tracker.git
   cd Inventory-Tracker
   ```

4. **Install dependencies & build**
   ```bash
   npm install
   npm run build
   ```

5. **Create `.env` file** with production values

6. **Use PM2 to run**
   ```bash
   npm install -g pm2
   pm2 start dist/server/entry.mjs --name inventory-tracker
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx reverse proxy** (optional)

---

## 🔒 Security Checklist Before Deployment

### 1. Generate Strong JWT Secret

Run this to generate a secure random string:

```powershell
# PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Update your production `.env`:
```
JWT_SECRET=YourGeneratedRandomString123456
```

### 2. Update MongoDB Network Access

In MongoDB Atlas:
- Go to "Network Access"
- For production, add your hosting provider's IP
- Or use "Allow Access from Anywhere" (0.0.0.0/0) for testing

### 3. Update CORS Settings (if needed)

If frontend is on different domain, update your API to allow CORS.

### 4. Environment Variables

Never commit your `.env` file! It's already in `.gitignore`.

---

## 📝 Post-Deployment Steps

### 1. Create First Admin User

Once deployed, register the first user:
- Go to: `https://your-app-url.com/login`
- Click "Sign Up"
- Create your admin account

### 2. Test All Features

- ✓ Login/Register
- ✓ Add item with image upload
- ✓ View items on dashboard
- ✓ Borrow/Return items
- ✓ Search and filters
- ✓ Profile page

### 3. Share with Users

Send your team:
- **App URL**: `https://your-app-url.com`
- **Instructions**: "Go to the URL, click 'Sign Up', and create your account"

---

## 🔄 Updating Your Deployment

When you make changes:

```powershell
# 1. Commit changes
git add .
git commit -m "Your update message"
git push origin main

# 2. Platform auto-deploys (Render/Railway/Vercel)
# OR manually redeploy if using your own server
```

---

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies in `package.json`
- Check build logs for errors

### Database Connection Error
- Verify `MONGODB_URI` environment variable
- Check MongoDB Atlas network access
- Verify username/password are correct

### Images Not Loading
- Check if `/public/uploads` directory exists
- Verify file upload permissions on server
- For cloud platforms, consider using cloud storage (AWS S3, Cloudinary)

### Users Can't Register
- Check JWT_SECRET is set
- Verify MongoDB connection
- Check browser console for errors

---

## 💾 Database Backup

Set up automatic backups in MongoDB Atlas:
1. Go to MongoDB Atlas dashboard
2. Click your cluster → "Backup" tab
3. Enable "Cloud Backup"
4. Configure backup schedule (daily recommended)

---

## 📊 Monitoring

For production, consider:
- **Uptime monitoring**: UptimeRobot (free)
- **Error tracking**: Sentry
- **Analytics**: Google Analytics or Plausible

---

## 🎉 You're Ready!

Your Inventory Tracker is now live and ready for users to access!

**Quick Start for New Users:**
1. Go to your app URL
2. Click "Sign Up"
3. Create account
4. Start adding inventory items!

