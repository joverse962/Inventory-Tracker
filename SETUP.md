# 🚀 Quick Start Guide

## Step 1: Install Dependencies

First, make sure you have Node.js installed on your system. Then run:

```bash
npm install
```

This will install all the base dependencies including Astro.

## Step 2: Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
```

If you need to initialize Tailwind config (already done):
```bash
npx tailwindcss init -p
```

## Step 3: Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:4321`

## Step 4: Explore the Features

### Dashboard (/)
- View all inventory items
- Filter by status, category, and location
- Search for specific items
- Click on items to see detailed modals
- Scan barcodes to find items quickly

### Add Item (/add-item)
- Add new items with photos
- Set location and category
- Add components/accessories
- Set initial status

### Profile (/profile)
- View currently borrowed items
- See borrowing history
- Track statistics

## 📦 What's Included

### ✅ Completed Features
- [x] Responsive layout with sidebar navigation
- [x] Dashboard with statistics
- [x] Item cards with status color coding
- [x] Interactive modals for item details
- [x] Barcode display (JsBarcode)
- [x] Barcode scanner component (UI ready)
- [x] Search and filter functionality
- [x] Component/accessory tracking
- [x] Add item form with dynamic components
- [x] User profile with borrowed items
- [x] Borrowing history table

### 🔧 Ready for Integration
- Backend API connection
- Real barcode scanning (camera)
- Image upload and storage
- User authentication
- Database integration

## 🎨 Customization

### Change Colors
Edit `tailwind.config.cjs` to customize the color scheme.

### Modify Sample Data
Edit the `items` array in `src/pages/index.astro` to change demo data.

### Add More Locations/Categories
Update the dropdown options in:
- `src/pages/add-item.astro`
- `src/components/FilterBar.astro`

## 🐛 Troubleshooting

### Port Already in Use
If port 4321 is busy, Astro will automatically use another port.

### Tailwind Styles Not Working
Make sure you've run:
```bash
npm install -D tailwindcss postcss autoprefixer
```

### Alpine.js Not Working
The BaseLayout includes Alpine.js via CDN. Make sure you have internet connection.

## 📚 Next Steps

1. **Connect to Backend**: Replace dummy data with API calls
2. **Add Authentication**: Implement user login/logout
3. **Image Upload**: Add real file upload functionality
4. **Barcode Scanning**: Integrate html5-qrcode or QuaggaJS
5. **Database**: Connect to your preferred database

## 🎯 Tech Stack

- **Astro**: Static site generator
- **Tailwind CSS**: Utility-first CSS framework
- **Alpine.js**: Lightweight JavaScript framework
- **JsBarcode**: Barcode generation

Enjoy building your inventory system! 🎉
