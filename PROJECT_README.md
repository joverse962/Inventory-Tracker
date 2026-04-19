# 📦 Inventory Tracker - Frontend

A modern, full-featured inventory management system built with **Astro** and **Tailwind CSS**.

## ✨ Features

### Core Functionality
- 📊 **Dashboard** - Overview of all inventory items with statistics
- ➕ **Add Items** - Form to add new items with photos and details
- 👤 **User Profile** - Track borrowed items and history
- 🔍 **Search & Filter** - Real-time filtering by status, category, and location
- 📤 **Borrow/Return System** - Track item borrowing and returns

### Advanced Features
- 🏷️ **Barcode Generation** - Automatically generate barcodes for items
- 📷 **Barcode Scanning** - Scan barcodes to quickly find items
- 🔗 **Component Tracking** - Track items with multiple components/accessories
- 🎨 **Status Color Coding** - Visual indicators for item status
  - ✅ Available (Green)
  - 📤 Borrowed (Yellow)
  - 🔧 Used (Gray)
  - 🗑️ Waste (Red)
- 📱 **Responsive Design** - Mobile-friendly interface
- 💫 **Interactive Modals** - Detailed item views with actions

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Tailwind CSS:**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
/
├── public/
│   └── images/              # Item images
├── src/
│   ├── components/
│   │   ├── Navbar.astro         # Top navigation bar
│   │   ├── Sidebar.astro        # Side menu
│   │   ├── ItemCard.astro       # Item display card with modal
│   │   └── FilterBar.astro      # Search and filter controls
│   ├── layouts/
│   │   └── BaseLayout.astro     # Main layout template
│   ├── pages/
│   │   ├── index.astro          # Dashboard (inventory list)
│   │   ├── add-item.astro       # Add new item form
│   │   └── profile.astro        # User profile page
│   └── styles/
│       └── global.css           # Global styles with Tailwind
├── astro.config.mjs
├── tailwind.config.cjs
├── postcss.config.cjs
└── package.json
```

## 🎯 Key Components

### ItemCard
Each item card includes:
- Item photo
- Name and description
- Status indicator with color coding
- Location and category
- Component list (if applicable)
- Interactive modal with:
  - Full item details
  - Action buttons (Borrow, Return, Mark as Taken, etc.)

### FilterBar
Real-time filtering by:
- Search query (name, description, user)
- Status (available, borrowed, taken, waste, need_repairing)
- Category (Electronics, Furniture, etc.)
- Location (Warehouse A/B, Office floors)

## 🎨 Styling

The project uses **Tailwind CSS** with:
- Responsive grid layouts
- Color-coded status indicators
- Smooth transitions and hover effects
- Mobile-first design approach

## 🔧 Customization

### Adding New Categories
Edit the category options in:
- `src/pages/add-item.astro` (form)
- `src/components/FilterBar.astro` (filter)

### Adding New Locations
Edit the location options in:
- `src/pages/add-item.astro` (form)
- `src/components/FilterBar.astro` (filter)

### Integrating a Backend
Replace the dummy data in `index.astro` with API calls:

```javascript
// Example with fetch
const response = await fetch('http://your-api.com/items');
const items = await response.json();
```

### Adding Real Barcode Scanning
Install a barcode scanning library:

```bash
npm install html5-qrcode
# or
npm install @ericblade/quagga2
```

Update `BarcodeScanner.astro` with the library integration.

## 📋 Sample Data Structure

```javascript
{
  id: 1,
  name: 'Dell Laptop XPS 15',
  status: 'available', // 'available' | 'borrowed' | 'used' | 'waste'
  photo: 'https://...',
  currentUser: null, // or 'John Doe'
  location: 'Warehouse A',
  category: 'Electronics',
  description: 'High-performance laptop...',
  components: [
    { name: 'Charger', quantity: 1 },
    { name: 'Mouse', quantity: 1 }
  ]
}
```

## 🌟 Future Enhancements

- [ ] User authentication and authorization
- [ ] Backend API integration
- [ ] Real-time updates with WebSockets
- [ ] Email notifications for due dates
- [ ] QR code support
- [ ] Export to CSV/PDF
- [ ] Admin dashboard
- [ ] Item reservation system
- [ ] Maintenance tracking
- [ ] Photo upload and storage

## 🛠️ Tech Stack

- **Framework:** Astro
- **Styling:** Tailwind CSS
- **Interactivity:** Alpine.js (via CDN)
- **Barcodes:** JsBarcode (via CDN)
- **Icons:** Emoji (no dependencies)

## 📝 License

MIT License - feel free to use this project for your own inventory management needs!

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues or questions, please open an issue on the GitHub repository.

---

Made with ❤️ using Astro and Tailwind CSS
