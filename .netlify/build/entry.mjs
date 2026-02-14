import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_CDzSoOCq.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/add-item.astro.mjs');
const _page2 = () => import('./pages/add-item.backup.astro.mjs');
const _page3 = () => import('./pages/api/auth/login.astro.mjs');
const _page4 = () => import('./pages/api/auth/me.astro.mjs');
const _page5 = () => import('./pages/api/auth/register.astro.mjs');
const _page6 = () => import('./pages/api/items/barcode/_barcode_.astro.mjs');
const _page7 = () => import('./pages/api/items/borrow/_id_.astro.mjs');
const _page8 = () => import('./pages/api/items/return/_id_.astro.mjs');
const _page9 = () => import('./pages/api/items/_id_.astro.mjs');
const _page10 = () => import('./pages/api/items.astro.mjs');
const _page11 = () => import('./pages/api/upload.astro.mjs');
const _page12 = () => import('./pages/index.backup.astro.mjs');
const _page13 = () => import('./pages/login.astro.mjs');
const _page14 = () => import('./pages/profile.astro.mjs');
const _page15 = () => import('./pages/profile.backup.astro.mjs');
const _page16 = () => import('./pages/test-upload.astro.mjs');
const _page17 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/add-item.astro", _page1],
    ["src/pages/add-item.backup.astro", _page2],
    ["src/pages/api/auth/login.ts", _page3],
    ["src/pages/api/auth/me.ts", _page4],
    ["src/pages/api/auth/register.ts", _page5],
    ["src/pages/api/items/barcode/[barcode].ts", _page6],
    ["src/pages/api/items/borrow/[id].ts", _page7],
    ["src/pages/api/items/return/[id].ts", _page8],
    ["src/pages/api/items/[id].ts", _page9],
    ["src/pages/api/items/index.ts", _page10],
    ["src/pages/api/upload.ts", _page11],
    ["src/pages/index.backup.astro", _page12],
    ["src/pages/login.astro", _page13],
    ["src/pages/profile.astro", _page14],
    ["src/pages/profile.backup.astro", _page15],
    ["src/pages/test-upload.astro", _page16],
    ["src/pages/index.astro", _page17]
]);
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: undefined
});
const _args = {
    "middlewareSecret": "1c2148aa-139a-4812-a8bc-e8dc4716d07b"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
