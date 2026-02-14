import { d as createComponent, i as renderComponent, j as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_C1Aja4dB.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CHSEmhwj.mjs';
export { renderers } from '../renderers.mjs';

const $$AddItem = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Add Item - Inventory Tracker" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-6 max-w-3xl mx-auto"> <h1 class="text-3xl font-bold text-[#4B0082] mb-6">➕ Add New Item</h1> <div class="bg-white rounded-lg shadow-lg p-6"> <form id="addItemForm" class="space-y-6"> <!-- Item Name --> <div> <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
Item Name *
</label> <input type="text" id="name" name="name" required placeholder="e.g., Dell Laptop XPS 15" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"> </div> <!-- Description --> <div> <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
Description *
</label> <textarea id="description" name="description" required rows="4" placeholder="Detailed description of the item..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea> </div> <!-- Category and Location Row --> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
Category *
</label> <input type="text" id="category" name="category" required placeholder="e.g., Electronics" list="categoryOptions" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"> <datalist id="categoryOptions"> <option value="Electronics"></option><option value="Furniture"></option><option value="Office Supplies"></option><option value="Tools"></option><option value="Equipment"></option></datalist> </div> <div> <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
Location *
</label> <input type="text" id="location" name="location" required placeholder="e.g., Warehouse A" list="locationOptions" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"> <datalist id="locationOptions"> <option value="Warehouse A"></option><option value="Warehouse B"></option><option value="Office Floor 1"></option><option value="Office Floor 2"></option><option value="Storage Room"></option></datalist> </div> </div> <!-- Quantity --> <div> <label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">
Quantity
</label> <input type="number" id="quantity" name="quantity" min="1" value="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"> </div> <!-- Photo Upload --> <div> <label for="photo" class="block text-sm font-medium text-gray-700 mb-2">
Item Photo
</label> <input type="file" id="photo" name="photo" accept="image/*" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"> <p class="text-sm text-gray-500 mt-1">Max file size: 5MB. Formats: JPEG, PNG, WebP</p> <!-- Image Preview --> <div id="imagePreview" class="mt-4 hidden"> <img id="previewImg" src="" alt="Preview" class="max-w-xs rounded-lg"> </div> </div> <!-- Components Section --> <div> <div class="flex justify-between items-center mb-2"> <label class="block text-sm font-medium text-gray-700">
Components / Accessories
</label> <button type="button" id="addComponentBtn" class="text-sm text-[#4B0082] hover:text-violet-950 font-medium">
+ Add Component
</button> </div> <div id="componentsContainer" class="space-y-2"> <!-- Components will be added here --> </div> </div> <!-- Barcode (Optional) --> <div> <label for="barcode" class="block text-sm font-medium text-gray-700 mb-2">
Barcode (Optional)
</label> <input type="text" id="barcode" name="barcode" placeholder="Leave empty to auto-generate" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"> <p class="text-sm text-gray-500 mt-1">If left empty, a barcode will be automatically generated</p> </div> <!-- Error Message --> <div id="errorMessage" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"></div> <!-- Success Message --> <div id="successMessage" class="hidden bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"></div> <!-- Buttons --> <div class="flex gap-4"> <button type="submit" id="submitBtn" class="flex-1 bg-[#4B0082] text-white py-3 px-6 rounded-lg hover:bg-violet-950 transition font-medium">
Add Item
</button> <a href="/" class="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition font-medium text-center">
Cancel
</a> </div> </form> </div> </div> ` })} ${renderScript($$result, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/add-item.astro?astro&type=script&index=0&lang.ts")}`;
}, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/add-item.astro", void 0);

const $$file = "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/add-item.astro";
const $$url = "/add-item";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AddItem,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
