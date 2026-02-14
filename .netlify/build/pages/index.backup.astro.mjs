import { c as createAstro, d as createComponent, r as renderTemplate, i as renderComponent, k as Fragment, l as defineScriptVars, f as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_C1Aja4dB.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CHSEmhwj.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

var __freeze$3 = Object.freeze;
var __defProp$3 = Object.defineProperty;
var __template$3 = (cooked, raw) => __freeze$3(__defProp$3(cooked, "raw", { value: __freeze$3(raw || cooked.slice()) }));
var _a$3;
const $$Astro = createAstro("http://localhost:4321");
const $$ItemCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ItemCard;
  const { item } = Astro2.props;
  const statusColors = {
    available: "bg-green-200 border-green-400",
    borrowed: "bg-yellow-200 border-yellow-400",
    used: "bg-gray-200 border-gray-400",
    waste: "bg-red-200 border-red-400"
  };
  const statusEmoji = {
    available: "\u2705",
    borrowed: "\u{1F4E4}",
    used: "\u{1F527}",
    waste: "\u{1F5D1}\uFE0F"
  };
  const status = item.status;
  return renderTemplate(_a$3 || (_a$3 = __template$3(["", "<div", ' x-data="{ showModal: false }"> <div @click="showModal = true"> <img', "", ' class="w-full h-40 object-cover rounded-md mb-3"> <h3 class="mt-2 font-bold text-lg">', '</h3> <p class="text-sm text-gray-700 flex items-center gap-1"> <span>', "</span> <span>Status: <strong>", "</strong></span> </p> ", " ", " ", ' </div> <!-- Modal --> <div x-show="showModal" @click.self="showModal = false" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="display: none;"> <div class="bg-white p-6 rounded-lg shadow-2xl max-w-2xl w-full mx-4" @click.stop> <div class="flex justify-between items-start mb-4"> <h2 class="text-2xl font-bold">', '</h2> <button @click="showModal = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button> </div> <img', "", ' class="w-full h-64 object-cover rounded-md mb-4"> <div class="grid grid-cols-2 gap-4 mb-4"> <div> <p class="text-sm text-gray-600">Status</p> <p class="font-semibold">', " ", '</p> </div> <div> <p class="text-sm text-gray-600">Current User</p> <p class="font-semibold">', "</p> </div> ", " ", " </div> ", " ", ' <!-- Barcode --> <div class="mb-4 flex justify-center"> <svg', ' class="barcode"></svg> </div> <script>(function(){', "\n        // Generate barcode when modal opens\n        import('https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js').then(module => {\n          const JsBarcode = module.default;\n          JsBarcode(`#barcode-${itemId}`, `ITEM${itemId.toString().padStart(6, '0')}`, {\n            format: \"CODE128\",\n            width: 2,\n            height: 40,\n            displayValue: true\n          });\n        });\n      })();<\/script> <!-- Action Buttons --> <div class=\"flex gap-2 mt-6\"> ", " ", " ", ' <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition">\n\u270F\uFE0F Edit\n</button> </div> </div> </div> </div>'], ["", "<div", ' x-data="{ showModal: false }"> <div @click="showModal = true"> <img', "", ' class="w-full h-40 object-cover rounded-md mb-3"> <h3 class="mt-2 font-bold text-lg">', '</h3> <p class="text-sm text-gray-700 flex items-center gap-1"> <span>', "</span> <span>Status: <strong>", "</strong></span> </p> ", " ", " ", ' </div> <!-- Modal --> <div x-show="showModal" @click.self="showModal = false" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="display: none;"> <div class="bg-white p-6 rounded-lg shadow-2xl max-w-2xl w-full mx-4" @click.stop> <div class="flex justify-between items-start mb-4"> <h2 class="text-2xl font-bold">', '</h2> <button @click="showModal = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button> </div> <img', "", ' class="w-full h-64 object-cover rounded-md mb-4"> <div class="grid grid-cols-2 gap-4 mb-4"> <div> <p class="text-sm text-gray-600">Status</p> <p class="font-semibold">', " ", '</p> </div> <div> <p class="text-sm text-gray-600">Current User</p> <p class="font-semibold">', "</p> </div> ", " ", " </div> ", " ", ' <!-- Barcode --> <div class="mb-4 flex justify-center"> <svg', ' class="barcode"></svg> </div> <script>(function(){', "\n        // Generate barcode when modal opens\n        import('https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js').then(module => {\n          const JsBarcode = module.default;\n          JsBarcode(\\`#barcode-\\${itemId}\\`, \\`ITEM\\${itemId.toString().padStart(6, '0')}\\`, {\n            format: \"CODE128\",\n            width: 2,\n            height: 40,\n            displayValue: true\n          });\n        });\n      })();<\/script> <!-- Action Buttons --> <div class=\"flex gap-2 mt-6\"> ", " ", " ", ' <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition">\n\u270F\uFE0F Edit\n</button> </div> </div> </div> </div>'])), maybeRenderHead(), addAttribute(`p-4 rounded-lg shadow border-2 ${statusColors[status]} cursor-pointer hover:shadow-xl transition-all`, "class"), addAttribute(item.image || "https://via.placeholder.com/300x200?text=" + item.name, "src"), addAttribute(item.name, "alt"), item.name, statusEmoji[status], status, item.currentUser && renderTemplate`<p class="text-sm text-gray-600 mt-1">By: ${item.currentUser}</p>`, item.location && renderTemplate`<p class="text-xs text-gray-500 mt-1">📍 ${item.location}</p>`, item.components && item.components.length > 0 && renderTemplate`<p class="text-xs text-blue-600 mt-2">🔗 ${item.components.length} component(s)</p>`, item.name, addAttribute(item.image || "https://via.placeholder.com/600x300?text=" + item.name, "src"), addAttribute(item.name, "alt"), statusEmoji[status], status, item.currentUser || "None", item.location && renderTemplate`<div> <p class="text-sm text-gray-600">Location</p> <p class="font-semibold">📍 ${item.location}</p> </div>`, item.category && renderTemplate`<div> <p class="text-sm text-gray-600">Category</p> <p class="font-semibold">${item.category}</p> </div>`, item.description && renderTemplate`<div class="mb-4"> <p class="text-sm text-gray-600">Description</p> <p class="text-gray-800">${item.description}</p> </div>`, item.components && item.components.length > 0 && renderTemplate`<div class="mb-4"> <p class="text-sm text-gray-600 mb-2">Components</p> <div class="space-y-2"> ${item.components.map((comp) => renderTemplate`<div class="bg-gray-100 p-2 rounded flex justify-between items-center"> <span>${comp.name}</span> <span class="text-xs text-gray-500">${comp.quantity}x</span> </div>`)} </div> </div>`, addAttribute(`barcode-${item.id}`, "id"), defineScriptVars({ itemId: item.id }), status === "available" && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <button class="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
📤 Borrow
</button> <button class="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
🔧 Mark as Used
</button> ` })}`, status === "borrowed" && renderTemplate`<button class="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
↩️ Return Item
</button>`, status === "used" && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <button class="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
✅ Mark Available
</button> <button class="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
🗑️ Mark as Waste
</button> ` })}`);
}, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/components/ItemCard.astro", void 0);

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
const $$FilterBar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$2 || (_a$2 = __template$2(["", `<div class="bg-white p-4 rounded-lg shadow mb-6" x-data="{ 
  search: '', 
  statusFilter: 'all', 
  categoryFilter: 'all',
  locationFilter: 'all'
}"> <div class="flex flex-col md:flex-row gap-4"> <!-- Search Bar --> <div class="flex-1"> <input type="text" x-model="search" placeholder="\u{1F50D} Search items..." class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" @input="window.filterItems && window.filterItems()"> </div> <!-- Status Filter --> <div> <select x-model="statusFilter" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" @change="window.filterItems && window.filterItems()"> <option value="all">All Status</option> <option value="available">\u2705 Available</option> <option value="borrowed">\u{1F4E4} Borrowed</option> <option value="used">\u{1F527} Used</option> <option value="waste">\u{1F5D1}\uFE0F Waste</option> </select> </div> <!-- Category Filter --> <div> <select x-model="categoryFilter" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" @change="window.filterItems && window.filterItems()"> <option value="all">All Categories</option> <option value="Electronics">Electronics</option> <option value="Furniture">Furniture</option> <option value="Office Supplies">Office Supplies</option> <option value="Tools">Tools</option> </select> </div> <!-- Location Filter --> <div> <select x-model="locationFilter" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" @change="window.filterItems && window.filterItems()"> <option value="all">All Locations</option> <option value="Warehouse A">Warehouse A</option> <option value="Warehouse B">Warehouse B</option> <option value="Office Floor 1">Office Floor 1</option> <option value="Office Floor 2">Office Floor 2</option> </select> </div> </div> <!-- Active Filters Display --> <div class="mt-3 flex gap-2 flex-wrap" x-show="search || statusFilter !== 'all' || categoryFilter !== 'all' || locationFilter !== 'all'"> <template x-if="search"> <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
Search: <strong x-text="search"></strong> <button @click="search = ''; window.filterItems && window.filterItems()" class="ml-1 text-blue-600 hover:text-blue-800">&times;</button> </span> </template> <template x-if="statusFilter !== 'all'"> <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
Status: <strong x-text="statusFilter"></strong> <button @click="statusFilter = 'all'; window.filterItems && window.filterItems()" class="ml-1 text-green-600 hover:text-green-800">&times;</button> </span> </template> <template x-if="categoryFilter !== 'all'"> <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
Category: <strong x-text="categoryFilter"></strong> <button @click="categoryFilter = 'all'; window.filterItems && window.filterItems()" class="ml-1 text-purple-600 hover:text-purple-800">&times;</button> </span> </template> <template x-if="locationFilter !== 'all'"> <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
Location: <strong x-text="locationFilter"></strong> <button @click="locationFilter = 'all'; window.filterItems && window.filterItems()" class="ml-1 text-orange-600 hover:text-orange-800">&times;</button> </span> </template> </div> <!-- Filter logic script --> <script>
    // This will be populated by the page
    window.filterItems = function() {
      // Filter logic will be implemented in the page
    };
  <\/script> </div>`])), maybeRenderHead());
}, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/components/FilterBar.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$BarcodeScanner = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", `<div x-data="{ showScanner: false, scanResult: '' }"> <!-- Barcode Scanner Button --> <button @click="showScanner = true" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition flex items-center gap-2">
\u{1F4F7} Scan Barcode
</button> <!-- Scanner Modal --> <div x-show="showScanner" @click.self="showScanner = false" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="display: none;"> <div class="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full mx-4" @click.stop> <div class="flex justify-between items-start mb-4"> <h2 class="text-xl font-bold">Scan Barcode</h2> <button @click="showScanner = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button> </div> <!-- Camera Preview --> <div class="bg-gray-200 rounded-lg mb-4 flex items-center justify-center" style="height: 300px;"> <div id="scanner-container" class="w-full h-full"> <p class="text-gray-500 text-center pt-32">\u{1F4F7} Camera preview would appear here</p> </div> </div> <!-- Manual Entry --> <div class="mb-4"> <label class="block text-sm font-medium text-gray-700 mb-2">Or enter manually:</label> <input type="text" x-model="scanResult" placeholder="ITEM000001" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"> </div> <!-- Actions --> <div class="flex gap-2"> <button @click="scanResult && (window.location.href = '/?search=' + scanResult)" class="flex-1 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition" :disabled="!scanResult" :class="!scanResult && 'opacity-50 cursor-not-allowed'">
Search Item
</button> <button @click="showScanner = false" class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition">
Cancel
</button> </div> <!-- Info --> <p class="text-xs text-gray-500 mt-4 text-center">
\u{1F4A1} Tip: You can use a barcode scanner device or enter the code manually
</p> </div> </div> <!-- Integration note for actual scanner library --> <script>
    // For actual barcode scanning, you would integrate a library like:
    // - QuaggaJS (for browser-based scanning)
    // - html5-qrcode
    // - ZXing
    // 
    // Example with html5-qrcode:
    // import { Html5Qrcode } from "html5-qrcode";
    // const html5QrCode = new Html5Qrcode("scanner-container");
    // html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanError);
  <\/script> </div>`])), maybeRenderHead());
}, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/components/BarcodeScanner.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const items = [
    {
      id: 1,
      name: "Dell Laptop XPS 15",
      status: "available",
      photo: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
      currentUser: null,
      location: "Warehouse A",
      category: "Electronics",
      description: "High-performance laptop with 16GB RAM and 512GB SSD",
      components: [
        { name: "Charger", quantity: 1 },
        { name: "Mouse", quantity: 1 },
        { name: "Carrying Case", quantity: 1 }
      ]
    },
    {
      id: 2,
      name: "Epson Projector",
      status: "borrowed",
      photo: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
      currentUser: "John Doe",
      location: "Office Floor 1",
      category: "Electronics",
      description: "4K projector with HDMI and wireless connectivity",
      components: [
        { name: "Power Cable", quantity: 1 },
        { name: "HDMI Cable", quantity: 1 },
        { name: "Remote Control", quantity: 1 }
      ]
    },
    {
      id: 3,
      name: "Mechanical Keyboard",
      status: "used",
      photo: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
      currentUser: null,
      location: "Office Floor 2",
      category: "Office Supplies",
      description: "RGB mechanical keyboard with blue switches"
    },
    {
      id: 4,
      name: "HP Printer LaserJet",
      status: "waste",
      photo: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400",
      currentUser: null,
      location: "Warehouse B",
      category: "Electronics",
      description: "Old printer - marked for disposal"
    },
    {
      id: 5,
      name: "Office Desk",
      status: "available",
      photo: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400",
      currentUser: null,
      location: "Warehouse A",
      category: "Furniture",
      description: "Adjustable standing desk"
    },
    {
      id: 6,
      name: "Ergonomic Chair",
      status: "borrowed",
      photo: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400",
      currentUser: "Jane Smith",
      location: "Office Floor 1",
      category: "Furniture",
      description: "Herman Miller Aeron chair"
    },
    {
      id: 7,
      name: "Tool Set",
      status: "available",
      photo: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400",
      currentUser: null,
      location: "Warehouse B",
      category: "Tools",
      description: "Complete screwdriver and wrench set",
      components: [
        { name: "Screwdrivers", quantity: 8 },
        { name: "Wrenches", quantity: 6 },
        { name: "Pliers", quantity: 3 },
        { name: "Tool Box", quantity: 1 }
      ]
    },
    {
      id: 8,
      name: "Whiteboard",
      status: "used",
      photo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400",
      currentUser: null,
      location: "Office Floor 2",
      category: "Office Supplies",
      description: "Large whiteboard with markers"
    }
  ];
  const stats = {
    total: items.length,
    available: items.filter((i) => i.status === "available").length,
    borrowed: items.filter((i) => i.status === "borrowed").length,
    used: items.filter((i) => i.status === "used").length,
    waste: items.filter((i) => i.status === "waste").length
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="mb-6 flex justify-between items-center"> <h2 class="text-3xl font-bold">\u{1F4E6} Inventory Dashboard</h2> ', ' </div>  <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"> <div class="bg-white p-4 rounded-lg shadow"> <p class="text-gray-500 text-sm">Total Items</p> <p class="text-2xl font-bold">', '</p> </div> <div class="bg-green-100 p-4 rounded-lg shadow"> <p class="text-green-700 text-sm">\u2705 Available</p> <p class="text-2xl font-bold text-green-700">', '</p> </div> <div class="bg-yellow-100 p-4 rounded-lg shadow"> <p class="text-yellow-700 text-sm">\u{1F4E4} Borrowed</p> <p class="text-2xl font-bold text-yellow-700">', '</p> </div> <div class="bg-gray-100 p-4 rounded-lg shadow"> <p class="text-gray-700 text-sm">\u{1F527} Used</p> <p class="text-2xl font-bold text-gray-700">', '</p> </div> <div class="bg-red-100 p-4 rounded-lg shadow"> <p class="text-red-700 text-sm">\u{1F5D1}\uFE0F Waste</p> <p class="text-2xl font-bold text-red-700">', "</p> </div> </div>  ", '  <div id="items-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> ', ' </div>  <div id="no-results" class="hidden text-center py-12"> <p class="text-gray-500 text-lg">No items found matching your filters</p> <button onclick="resetFilters()" class="mt-4 text-blue-500 hover:text-blue-700">Clear all filters</button> </div>  <script>(function(){', `
    const allItems = items;
    
    window.filterItems = function() {
      const search = document.querySelector('[x-model="search"]')?.value?.toLowerCase() || '';
      const statusFilter = document.querySelector('[x-model="statusFilter"]')?.value || 'all';
      const categoryFilter = document.querySelector('[x-model="categoryFilter"]')?.value || 'all';
      const locationFilter = document.querySelector('[x-model="locationFilter"]')?.value || 'all';
      
      const filtered = allItems.filter(item => {
        const matchesSearch = !search || 
          item.name.toLowerCase().includes(search) ||
          (item.description && item.description.toLowerCase().includes(search)) ||
          (item.currentUser && item.currentUser.toLowerCase().includes(search));
        
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        const matchesLocation = locationFilter === 'all' || item.location === locationFilter;
        
        return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
      });
      
      // Show/hide items
      const grid = document.getElementById('items-grid');
      const noResults = document.getElementById('no-results');
      const cards = grid.querySelectorAll('[x-data]');
      
      let visibleCount = 0;
      cards.forEach((card, index) => {
        const shouldShow = filtered.some(item => item.id === allItems[index].id);
        card.style.display = shouldShow ? 'block' : 'none';
        if (shouldShow) visibleCount++;
      });
      
      // Show/hide no results message
      if (visibleCount === 0) {
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
      }
    };
    
    window.resetFilters = function() {
      document.querySelector('[x-model="search"]').value = '';
      document.querySelector('[x-model="statusFilter"]').value = 'all';
      document.querySelector('[x-model="categoryFilter"]').value = 'all';
      document.querySelector('[x-model="locationFilter"]').value = 'all';
      window.filterItems();
    };
  })();<\/script> `])), maybeRenderHead(), renderComponent($$result2, "BarcodeScanner", $$BarcodeScanner, {}), stats.total, stats.available, stats.borrowed, stats.used, stats.waste, renderComponent($$result2, "FilterBar", $$FilterBar, {}), items.map((item) => renderTemplate`${renderComponent($$result2, "ItemCard", $$ItemCard, { "item": item })}`), defineScriptVars({ items })) })}`;
}, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/index.backup.astro", void 0);

const $$file = "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/index.backup.astro";
const $$url = "/index.backup";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
