# Backend API Documentation

## Overview
This inventory tracker includes a full-featured backend with authentication, database storage, file uploads, and barcode tracking.

## Tech Stack
- **Runtime**: Node.js with Astro SSR
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Native Node.js file system
- **Password Hashing**: bcryptjs

## Setup

### 1. Install Dependencies
```bash
npm install @astrojs/node mongoose bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Required variables:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens (use a strong random string)
- `PORT`: Server port (default: 4321)

### 3. Start MongoDB
Make sure MongoDB is running locally or use MongoDB Atlas:
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud database)
# Get your connection string from https://cloud.mongodb.com
```

### 4. Run the Application
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Items

#### Get All Items
```http
GET /api/items
Authorization: Bearer <token>

# Optional query parameters:
?status=available&category=Electronics&location=Warehouse&search=laptop
```

#### Create New Item
```http
POST /api/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Laptop",
  "description": "Dell XPS 15",
  "category": "Electronics",
  "location": "Office",
  "quantity": 1,
  "components": [
    { "name": "Charger", "quantity": 1 },
    { "name": "Mouse", "quantity": 1 }
  ],
  "image": "/uploads/laptop.jpg"
}
```

#### Get Single Item
```http
GET /api/items/:id
Authorization: Bearer <token>
```

#### Update Item
```http
PUT /api/items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "available"
}
```

#### Delete Item
```http
DELETE /api/items/:id
Authorization: Bearer <token>
```

### Borrow/Return

#### Borrow Item
```http
POST /api/items/borrow/:id
Authorization: Bearer <token>
```

#### Return Item
```http
POST /api/items/return/:id
Authorization: Bearer <token>
```

### Barcode

#### Get Item by Barcode
```http
GET /api/items/barcode/:barcode
Authorization: Bearer <token>
```

### File Upload

#### Upload Image
```http
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <image file>
```

Response:
```json
{
  "url": "/uploads/filename.jpg",
  "filename": "filename.jpg"
}
```

## Data Models

### User
```typescript
{
  email: string;
  password: string; // hashed
  name: string;
  role: 'admin' | 'user';
  borrowedItems: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Item
```typescript
{
  name: string;
  description: string;
  category: string;
  location: string;
  status: 'available' | 'borrowed' | 'used' | 'waste';
  barcode: string; // auto-generated if not provided
  image: string;
  components: Array<{
    name: string;
    quantity: number;
    condition?: string;
  }>;
  borrowedBy: ObjectId;
  borrowedAt: Date;
  quantity: number;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

## Authentication Flow

1. User registers or logs in
2. Server returns JWT token
3. Client stores token (localStorage/cookie)
4. Client includes token in `Authorization: Bearer <token>` header for all API requests
5. Server verifies token and grants access

## File Upload Guidelines

- **Max file size**: 5MB
- **Allowed formats**: JPEG, PNG, WebP
- **Storage**: `/public/uploads/`
- **Naming**: `timestamp-random.ext`

## Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message here"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- File type restrictions
- File size limits
- Protected routes

## Next Steps

1. Connect frontend to API endpoints
2. Add proper error handling in UI
3. Implement loading states
4. Add image preview before upload
5. Create admin dashboard
6. Add user roles and permissions
7. Implement audit logs
8. Add email notifications
