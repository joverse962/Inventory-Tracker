import { d as createComponent, i as renderComponent, j as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_C1Aja4dB.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CHSEmhwj.mjs';
export { renderers } from '../renderers.mjs';

const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Profile - Inventory Tracker" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-6 max-w-4xl mx-auto"> <!-- Header --> <div class="flex justify-between items-center mb-6"> <h1 class="text-3xl font-bold text-gray-900">👤 My Profile</h1> <button id="logoutBtn" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
Logout
</button> </div> <!-- Loading State --> <div id="loadingState" class="text-center py-12"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> <p class="mt-4 text-gray-600">Loading profile...</p> </div> <!-- Error State --> <div id="errorState" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"></div> <!-- Profile Content --> <div id="profileContent" class="hidden space-y-6"> <!-- User Info Card --> <div class="bg-white rounded-lg shadow-lg p-6"> <h2 class="text-xl font-semibold text-gray-900 mb-4">User Information</h2> <div class="space-y-3"> <div> <span class="text-gray-600 font-medium">Name:</span> <span id="userName" class="text-gray-900 ml-2"></span> </div> <div> <span class="text-gray-600 font-medium">Email:</span> <span id="userEmail" class="text-gray-900 ml-2"></span> </div> <div> <span class="text-gray-600 font-medium">Role:</span> <span id="userRole" class="text-gray-900 ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"></span> </div> </div> </div> <!-- Statistics Card --> <div class="bg-white rounded-lg shadow-lg p-6"> <h2 class="text-xl font-semibold text-gray-900 mb-4">My Statistics</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"> <div class="text-center p-4 bg-blue-50 rounded-lg"> <div class="text-3xl font-bold text-blue-600" id="itemsBorrowed">0</div> <div class="text-sm text-gray-600 mt-1">Currently Borrowed</div> </div> <div class="text-center p-4 bg-green-50 rounded-lg"> <div class="text-3xl font-bold text-green-600" id="itemsCreated">0</div> <div class="text-sm text-gray-600 mt-1">Items Created</div> </div> <div class="text-center p-4 bg-purple-50 rounded-lg"> <div class="text-3xl font-bold text-purple-600" id="totalBorrows">0</div> <div class="text-sm text-gray-600 mt-1">Total Borrows</div> </div> </div> </div> <!-- Currently Borrowed Items --> <div class="bg-white rounded-lg shadow-lg p-6"> <h2 class="text-xl font-semibold text-gray-900 mb-4">📦 Currently Borrowed Items</h2> <div id="emptyBorrowed" class="hidden text-center py-8 text-gray-500"> <svg class="mx-auto h-16 w-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path> </svg> <p>You haven't borrowed any items yet.</p> </div> <div id="borrowedItemsList" class="space-y-3"> <!-- Borrowed items will be listed here --> </div> </div> <!-- Borrow History --> <div class="bg-white rounded-lg shadow-lg p-6"> <h2 class="text-xl font-semibold text-gray-900 mb-4">📜 Borrow History</h2> <div id="emptyHistory" class="hidden text-center py-8 text-gray-500"> <p>No borrow history available.</p> </div> <div id="historyList" class="space-y-2"> <!-- History will be listed here --> <p class="text-gray-500 text-center py-4">History tracking coming soon...</p> </div> </div> </div> </div> ` })} ${renderScript($$result, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/profile.astro?astro&type=script&index=0&lang.ts")}`;
}, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/profile.astro", void 0);

const $$file = "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/profile.astro";
const $$url = "/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profile,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
