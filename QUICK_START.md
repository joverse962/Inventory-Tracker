# 🚀 Quick Start Guide

## Installation

1. **Install dependencies** (requires npm, yarn, pnpm, or bun):
   ```bash
   npm install
   ```

2. **Set up MongoDB**:
   
   **Option A - MongoDB Atlas (Recommended - Free Cloud Database)**:
   - Create account at https://cloud.mongodb.com
   - Create a free cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Update `MONGODB_URI` in `.env` file

   **Option B - Local MongoDB**:
   - Download from https://www.mongodb.com/try/download/community  
   - Install and start MongoDB service
   - Use connection string: `mongodb://localhost:27017/inventory-tracker`

3. **Configure environment variables**:
   
   The `.env` file has been created for you. You need to:
   - Update `MONGODB_URI` with your MongoDB connection string
   - Optionally change the `JWT_SECRET` to a strong random key

   To generate a secure JWT_SECRET, run:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Navigate to http://localhost:4321
   - You'll be redirected to the login page
   - Register a new account to get started

## First Steps

1. **Register an account** at http://localhost:4321/login
2. **Add your first item** using the "Add Item" button
3. **Browse your inventory** on the dashboard
4. **Search and filter** items using the filter bar
5. **Borrow/Return items** by clicking on them

## Features Available

✅ **User Authentication** - Register/Login with JWT tokens  
✅ **Inventory Management** - Create, read, update, delete items  
✅ **File Uploads** - Upload item photos (max 5MB)  
✅ **Barcode System** - Auto-generated barcodes for all items  
✅ **Borrow/Return** - Track who has borrowed items  
✅ **Components Tracking** - Track items with multiple components  
✅ **Search & Filter** - Real-time filtering by status, category, location  
✅ **User Profile** - View borrowed items and statistics  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  

## Project Structure

```
src/
├── pages/
│   ├── index.astro          # Dashboard with item grid
│   ├── login.astro          # Login/Register page
│   ├── add-item.astro       # Add new item form
│   ├── profile.astro        # User profile page
│   └── api/                 # Backend API routes
│       ├── auth/            # Authentication endpoints
│       ├── items/           # Inventory CRUD endpoints
│       └── upload.ts        # File upload endpoint
├── lib/
│   ├── db.ts               # MongoDB connection
│   ├── auth.ts             # JWT authentication
│   ├── api.ts              # Frontend API client
│   └── middleware.ts       # Auth middleware
├── models/
│   ├── User.ts             # User database model
│   └── Item.ts             # Item database model
└── components/             # Reusable UI components
```

## API Endpoints

All API endpoints are documented in [BACKEND_README.md](BACKEND_README.md)

### Quick Reference:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `POST /api/items/borrow/:id` - Borrow item
- `POST /api/items/return/:id` - Return item
- `POST /api/upload` - Upload image

## Troubleshooting

### Cannot connect to MongoDB
- Verify MongoDB is running (if local)
- Check `MONGODB_URI` in `.env` file
- Ensure network access is allowed (MongoDB Atlas)

### Module not found errors
- Run `npm install` to install all dependencies
- Check that you're in the project root directory

### Port already in use
- Change `PORT` in `.env` file
- Or kill the process using port 4321

### Images not uploading
- Check file size (max 5MB)
- Ensure file format is JPEG, PNG, or WebP
- Verify `public/uploads/` directory exists

## Production Deployment

1. Update `.env` with production values
2. Generate a strong `JWT_SECRET`
3. Use a production MongoDB instance
4. Build the project:
   ```bash
   npm run build
   ```
5. Deploy to your hosting provider (Vercel, Netlify, etc.)

## Need Help?

- Backend Documentation: [BACKEND_README.md](BACKEND_README.md)
- Backend Setup: [BACKEND_SETUP.md](BACKEND_SETUP.md)
- Project Details: [PROJECT_README.md](PROJECT_README.md)
