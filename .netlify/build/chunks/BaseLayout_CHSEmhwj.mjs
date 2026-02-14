import { d as createComponent, m as maybeRenderHead, r as renderTemplate, c as createAstro, f as addAttribute, n as renderSlot, i as renderComponent, o as renderHead } from './astro/server_C1Aja4dB.mjs';
import 'piccolore';
import 'clsx';
/* empty css                            */

const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav class="bg-white shadow p-4 flex justify-between items-center"> <div class="flex items-center"> <img src="/images/CM-icon.png" alt="CM Logo" class="h-8 w-auto mr-2"> <h1 class="font-bold text-xl text-[#4B0082]">Inventory Tracker</h1> </div> <div class="flex items-center gap-4"> <div class="relative" x-data="{ open: false }"> <button @click="open = !open" class="px-4 py-2 bg-[#4B0082] text-white rounded hover:bg-violet-950 transition">
Profile
</button> <div x-show="open" @click.away="open = false" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10" style="display: none;"> <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</a> <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a> <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a> </div> </div> </div> </nav>`;
}, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/components/Navbar.astro", void 0);

const $$Astro = createAstro("http://localhost:4321");
const $$Sidebar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Sidebar;
  const currentPath = Astro2.url.pathname;
  return renderTemplate`${maybeRenderHead()}<aside class="w-64 bg-gray-800 text-white p-4 flex flex-col gap-2"> <div class="mb-6 flex flex-col items-center"> <img src="/images/CM.png" alt="CM Logo" class="h-10 w-auto mb-2"> <!-- <h2 class="text-2xl font-bold">Menu</h2> --> </div> <a href="/"${addAttribute(`hover:bg-gray-700 p-3 rounded transition flex items-center gap-2 ${currentPath === "/" ? "bg-gray-700" : ""}`, "class")}> <span>🏠</span> <span>Dashboard</span> </a> <a href="/add-item"${addAttribute(`hover:bg-gray-700 p-3 rounded transition flex items-center gap-2 ${currentPath === "/add-item" ? "bg-gray-700" : ""}`, "class")}> <span>➕</span> <span>Add Item</span> </a> <a href="/profile"${addAttribute(`hover:bg-gray-700 p-3 rounded transition flex items-center gap-2 ${currentPath === "/profile" ? "bg-gray-700" : ""}`, "class")}> <span>👤</span> <span>Profile</span> </a> <hr class="my-4 border-gray-600"> <div class="mt-auto"> <p class="text-xs text-gray-400">v1.0.0</p> </div> </aside>`;
}, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/components/Sidebar.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Inventory Tracker</title>', '</head> <body class="flex min-h-screen"> ', ' <div class="flex-1 flex flex-col"> ', ' <main class="p-6 flex-1"> ', ' </main> </div> <!-- Alpine.js for interactive components --> <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"><\/script> </body> </html>'])), renderHead(), renderComponent($$result, "Sidebar", $$Sidebar, {}), renderComponent($$result, "Navbar", $$Navbar, {}), renderSlot($$result, $$slots["default"]));
}, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
