import { d as createComponent, i as renderComponent, j as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_C1Aja4dB.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CHSEmhwj.mjs';
export { renderers } from '../renderers.mjs';

const $$TestUpload = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Test Upload" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-6 max-w-2xl mx-auto"> <h1 class="text-2xl font-bold mb-4">Test Image Upload</h1> <div class="bg-white p-6 rounded-lg shadow"> <form id="testForm"> <div class="mb-4"> <label class="block mb-2">Select Image:</label> <input type="file" id="testFile" accept="image/*" class="border p-2"> </div> <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
Test Upload
</button> </form> <div id="result" class="mt-4 p-4 bg-gray-100 rounded hidden"></div> <div id="testImage" class="mt-4 hidden"> <h3 class="font-bold mb-2">Uploaded Image:</h3> <img id="uploadedImg" src="" alt="Test" class="max-w-md"> </div> </div> </div> ` })} ${renderScript($$result, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/test-upload.astro?astro&type=script&index=0&lang.ts")}`;
}, "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/test-upload.astro", void 0);

const $$file = "/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/test-upload.astro";
const $$url = "/test-upload";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TestUpload,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
