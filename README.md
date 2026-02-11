# 📦 Inventory Tracker

A modern, full-stack inventory management system built with Astro, MongoDB, and Node.js.

## ✨ Features

- 🔐 **User Authentication** - Secure login/register with JWT
- 📦 **Item Management** - Add, view, search, and filter inventory items
- 📸 **Image Upload** - Upload and display item photos
- 🔄 **Borrow/Return System** - Track who has what equipment
- 🏷️ **Barcode Support** - Auto-generate or use custom barcodes
- 🔍 **Advanced Search** - Filter by status, category, location, or search text
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ☁️ **Cloud Database** - MongoDB Atlas for reliable data storage

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works!)
- Git installed

### Local Development

1. **Clone the repository**
   ```powershell
   git clone https://github.com/your-username/Inventory-Tracker.git
   cd Inventory-Tracker
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Setup environment variables**
   - Copy `.env.example` to `.env`
   - Update with your MongoDB URI and JWT secret
   ```powershell
   cp .env.example .env
   ```

4. **Start development server**
   ```powershell
   npm run dev
   ```

5. **Open browser**
   - Go to `http://localhost:4321`
   - Create an account and start adding items!

## 📚 Documentation

- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production (Render, Railway, etc.)
- **[Deployment Checklist](DEPLOY_CHECKLIST.md)** - Step-by-step deployment checklist
- **[User Guide](USER_GUIDE.md)** - End-user documentation
- **[Backend Setup](BACKEND_SETUP.md)** - Backend configuration details
- **[MongoDB Setup](MONGODB_SETUP.md)** - Database configuration

## 🎯 Deployment (Production)

### Fastest: Deploy to Render.com (FREE)

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service from your repository
4. Set environment variables
5. Deploy!

**Detailed instructions**: See [DEPLOYMENT.md](DEPLOYMENT.md)

## 🧞 Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Install dependencies                            |
| `npm run dev`             | Start dev server at `localhost:4321`      |
| `npm run build`           | Build production site to `./dist/`          |
| `npm start`               | Run production build                     |
| `npm run preview`         | Preview build locally before deploying     |

## 🛠️ Tech Stack

- **Frontend**: Astro, Tailwind CSS, Alpine.js
- **Backend**: Node.js, Express-style API routes
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Native Node.js filesystem
- **Deployment**: Node.js standalone adapter

## 📂 Project Structure

```
inventory-tracker/
├── src/
│   ├── components/       # Reusable Astro components
│   ├── layouts/          # Page layouts
│   ├── lib/              # Utilities (auth, db, API)
│   ├── models/           # MongoDB schemas
│   ├── pages/            # Routes and API endpoints
│   └── styles/           # Global CSS
├── public/
│   └── uploads/          # Uploaded item images
├── .env                  # Environment variables (not committed)
├── package.json          # Dependencies and scripts
└── astro.config.mjs      # Astro configuration
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation
- File upload restrictions
- Environment variable protection

## 🌟 Key Features Explained

### Authentication
- Secure user registration and login
- Password encryption
- Session management with JWT tokens
- Protected routes

### Inventory Management
- Add items with photos, descriptions, categories
- Auto-generated or custom barcodes
- Component tracking for items with accessories
- Quantity management

### Borrowing System
- Borrow available items
- Track who has what
- Return items to make available again
- View borrowed items in profile

### Search & Filter
- Text search across name, description, barcode
- Filter by status (available, borrowed, in use, waste)
- Filter by category and location
- Real-time results

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

- Check the [User Guide](USER_GUIDE.md) for usage instructions
- Review [Deployment Guide](DEPLOYMENT.md) for deployment help
- Open an issue on GitHub for bugs
- Contact the maintainer for questions

## 🎉 Credits

Built with ❤️ using [Astro](https://astro.build)

---

**Ready to deploy?** → See [DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)
