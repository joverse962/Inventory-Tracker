import { d as createComponent, i as renderComponent, j as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_C1Aja4dB.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CHSEmhwj.mjs';
export { renderers } from '../renderers.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Login - Inventory Tracker" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center bg-gray-100 px-4"> <div class="max-w-md w-full"> <!-- Login Card --> <div id="loginCard" class="bg-white rounded-lg shadow-lg p-8"> <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Login</h2> <form id="loginForm" class="space-y-4"> <div> <label for="loginEmail" class="block text-sm font-medium text-gray-700 mb-1">Email</label> <input type="email" id="loginEmail" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="you@example.com"> </div> <div> <label for="loginPassword" class="block text-sm font-medium text-gray-700 mb-1">Password</label> <input type="password" id="loginPassword" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••"> </div> <div id="loginError" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"></div> <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium">
Login
</button> </form> <p class="mt-4 text-center text-sm text-gray-600">
Don't have an account?
<button id="showRegister" class="text-blue-600 hover:underline font-medium">Register</button> </p> </div> <!-- Register Card --> <div id="registerCard" class="bg-white rounded-lg shadow-lg p-8 hidden"> <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Register</h2> <form id="registerForm" class="space-y-4"> <div> <label for="registerName" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label> <input type="text" id="registerName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="John Doe"> </div> <div> <label for="registerEmail" class="block text-sm font-medium text-gray-700 mb-1">Email</label> <input type="email" id="registerEmail" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="you@example.com"> </div> <div> <label for="registerPassword" class="block text-sm font-medium text-gray-700 mb-1">Password</label> <input type="password" id="registerPassword" required minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••"> <p class="text-xs text-gray-500 mt-1">At least 6 characters</p> </div> <div id="registerError" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"></div> <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium">
Register
</button> </form> <p class="mt-4 text-center text-sm text-gray-600">
Already have an account?
<button id="showLogin" class="text-blue-600 hover:underline font-medium">Login</button> </p> </div> </div> </div> ` })} ${renderScript($$result, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/login.astro", void 0);

const $$file = "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
