# MongoDB Setup Guide

## Quick Fix: Use MongoDB Atlas (Recommended)

MongoDB Atlas is a free cloud database - no installation needed!

### Steps:

1. **Sign up** at https://cloud.mongodb.com
2. **Create Free Cluster**:
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a cloud provider and region (closest to you)
   - Click "Create"

3. **Create Database User**:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Set permissions to "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**:
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add your IP)
   - Click "Confirm"

5. **Get Connection String**:
   - Go back to "Database" in left sidebar
   - Click "Connect" button on your cluster
   - Choose "Drivers"
   - Copy the connection string (looks like `mongodb+srv://...`)
   - Replace `<password>` with your actual password
   - Add database name: `/inventory-tracker` before the `?`

6. **Update `.env` file**:
   ```
   MONGODB_URI=mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/inventory-tracker?retryWrites=true&w=majority
   ```

7. **Restart your dev server** (Ctrl+C then `npm run dev`)

---

## Alternative: Local MongoDB Installation

### Windows:

1. **Download MongoDB Community Server**:
   - Go to https://www.mongodb.com/try/download/community
   - Download Windows MSI installer
   - Run installer (choose "Complete" setup)

2. **Start MongoDB Service**:
   ```powershell
   # Start MongoDB service
   net start MongoDB
   
   # Or if not installed as service:
   "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
   ```

3. **Create data directory** (if needed):
   ```powershell
   mkdir C:\data\db
   ```

4. **Verify it's running**:
   - MongoDB should be accessible at `mongodb://localhost:27017`
   - Your `.env` is already configured for this

5. **Restart your dev server**

### macOS:

```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongosh
```

### Linux:

```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## Troubleshooting

### "MongoDB service won't start" (Windows)
Try running as administrator:
```powershell
net start MongoDB
```

### "Connection timeout"
- Check if MongoDB is running:
  ```powershell
  # Windows
  Get-Service -Name MongoDB
  
  # Or check if port 27017 is listening
  netstat -an | findstr 27017
  ```

### "Authentication failed" (Atlas)
- Verify username and password in connection string
- Make sure password doesn't contain special characters (or URL encode them)
- Check that user has proper permissions

### Still having issues?
Use MongoDB Atlas - it's easier and free for development!

---

## Quick Test

Once MongoDB is running, test the connection:

```javascript
// Create test.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory-tracker')
  .then(() => {
    console.log('✅ MongoDB Connected!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });
```

Run: `node test.js`
