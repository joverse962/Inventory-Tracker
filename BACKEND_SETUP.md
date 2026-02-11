# Backend Setup Instructions

## 1. Install Required Dependencies

Run this command to install all backend dependencies:

```bash
npm install @astrojs/node mongoose bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```

Or if npm is not available in your terminal, you can manually add these to your package.json:

**Add to "dependencies":**
```json
"@astrojs/node": "^9.1.0",
"mongoose": "^8.0.0",
"bcryptjs": "^2.4.3",
"jsonwebtoken": "^9.0.2"
```

**Add to "devDependencies":**
```json
"@types/bcryptjs": "^2.4.6",
"@types/jsonwebtoken": "^9.0.5"
```

## 2. Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and update these values:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong random secret key for JWT tokens

## 3. Install MongoDB

You have two options:

### Option A: Local MongoDB
1. Download from https://www.mongodb.com/try/download/community
2. Install and start the service
3. Use connection string: `mongodb://localhost:27017/inventory-tracker`

### Option B: MongoDB Atlas (Cloud - Recommended)
1. Create account at https://cloud.mongodb.com
2. Create a free cluster
3. Get connection string from "Connect" button
4. Update `MONGODB_URI` in `.env` file

## 4. Create .env File

Create a `.env` file in the root directory with:

```env
MONGODB_URI=mongodb://localhost:27017/inventory-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=4321
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./public/uploads
```

**Important**: Generate a strong JWT_SECRET. You can use this command:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 5. Start the Server

```bash
npm run dev
```

## 6. Test the Backend

You can test the API endpoints using:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- Or build the frontend to connect to it

### Example: Register a User
```bash
curl -X POST http://localhost:4321/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running
- Check your connection string in `.env`
- Verify network access if using MongoDB Atlas

### Module Not Found Errors
- Run `npm install` to install all dependencies
- Make sure you're in the project root directory

### Port Already in Use
- Change the PORT in `.env`
- Or kill the process using port 4321

## Next Steps

See [BACKEND_README.md](BACKEND_README.md) for:
- Complete API documentation
- All available endpoints
- Request/response examples
- Authentication flow
- Data models
