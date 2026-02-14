import 'piccolore';
import { p as NOOP_MIDDLEWARE_HEADER, q as decodeKey } from './chunks/astro/server_C1Aja4dB.mjs';
import 'clsx';
import 'es-module-lexer';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/","cacheDir":"file:///mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/node_modules/.astro/","outDir":"file:///mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/dist/","srcDir":"file:///mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/","publicDir":"file:///mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/public/","buildClientDir":"file:///mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/dist/","buildServerDir":"file:///mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/add-item.BxU7JGOR.css"}],"routeData":{"route":"/add-item","isIndex":false,"type":"page","pattern":"^\\/add-item\\/?$","segments":[[{"content":"add-item","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/add-item.astro","pathname":"/add-item","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/add-item.BxU7JGOR.css"}],"routeData":{"route":"/add-item.backup","isIndex":false,"type":"page","pattern":"^\\/add-item\\.backup\\/?$","segments":[[{"content":"add-item.backup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/add-item.backup.astro","pathname":"/add-item.backup","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/login","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/login\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/login.ts","pathname":"/api/auth/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/me","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/me\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"me","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/me.ts","pathname":"/api/auth/me","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/register","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/register\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/register.ts","pathname":"/api/auth/register","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/items/barcode/[barcode]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/items\\/barcode\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"items","dynamic":false,"spread":false}],[{"content":"barcode","dynamic":false,"spread":false}],[{"content":"barcode","dynamic":true,"spread":false}]],"params":["barcode"],"component":"src/pages/api/items/barcode/[barcode].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/items/borrow/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/items\\/borrow\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"items","dynamic":false,"spread":false}],[{"content":"borrow","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/items/borrow/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/items/return/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/items\\/return\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"items","dynamic":false,"spread":false}],[{"content":"return","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/items/return/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/items/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/items\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"items","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/items/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/items","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/items\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"items","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/items/index.ts","pathname":"/api/items","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/upload","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/upload\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"upload","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/upload.ts","pathname":"/api/upload","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/add-item.BxU7JGOR.css"}],"routeData":{"route":"/index.backup","isIndex":false,"type":"page","pattern":"^\\/index\\.backup\\/?$","segments":[[{"content":"index.backup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/index.backup.astro","pathname":"/index.backup","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/add-item.BxU7JGOR.css"}],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/add-item.BxU7JGOR.css"}],"routeData":{"route":"/profile","isIndex":false,"type":"page","pattern":"^\\/profile\\/?$","segments":[[{"content":"profile","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/profile.astro","pathname":"/profile","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/add-item.BxU7JGOR.css"}],"routeData":{"route":"/profile.backup","isIndex":false,"type":"page","pattern":"^\\/profile\\.backup\\/?$","segments":[[{"content":"profile.backup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/profile.backup.astro","pathname":"/profile.backup","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/add-item.BxU7JGOR.css"}],"routeData":{"route":"/test-upload","isIndex":false,"type":"page","pattern":"^\\/test-upload\\/?$","segments":[[{"content":"test-upload","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/test-upload.astro","pathname":"/test-upload","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/add-item.BxU7JGOR.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"http://localhost:4321","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/add-item.astro",{"propagation":"none","containsHead":true}],["/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/add-item.backup.astro",{"propagation":"none","containsHead":true}],["/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/index.backup.astro",{"propagation":"none","containsHead":true}],["/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/login.astro",{"propagation":"none","containsHead":true}],["/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/profile.astro",{"propagation":"none","containsHead":true}],["/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/profile.backup.astro",{"propagation":"none","containsHead":true}],["/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/test-upload.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/add-item@_@astro":"pages/add-item.astro.mjs","\u0000@astro-page:src/pages/add-item.backup@_@astro":"pages/add-item.backup.astro.mjs","\u0000@astro-page:src/pages/api/auth/login@_@ts":"pages/api/auth/login.astro.mjs","\u0000@astro-page:src/pages/api/auth/me@_@ts":"pages/api/auth/me.astro.mjs","\u0000@astro-page:src/pages/api/auth/register@_@ts":"pages/api/auth/register.astro.mjs","\u0000@astro-page:src/pages/api/items/barcode/[barcode]@_@ts":"pages/api/items/barcode/_barcode_.astro.mjs","\u0000@astro-page:src/pages/api/items/borrow/[id]@_@ts":"pages/api/items/borrow/_id_.astro.mjs","\u0000@astro-page:src/pages/api/items/return/[id]@_@ts":"pages/api/items/return/_id_.astro.mjs","\u0000@astro-page:src/pages/api/items/[id]@_@ts":"pages/api/items/_id_.astro.mjs","\u0000@astro-page:src/pages/api/items/index@_@ts":"pages/api/items.astro.mjs","\u0000@astro-page:src/pages/api/upload@_@ts":"pages/api/upload.astro.mjs","\u0000@astro-page:src/pages/index.backup@_@astro":"pages/index.backup.astro.mjs","\u0000@astro-page:src/pages/login@_@astro":"pages/login.astro.mjs","\u0000@astro-page:src/pages/profile@_@astro":"pages/profile.astro.mjs","\u0000@astro-page:src/pages/profile.backup@_@astro":"pages/profile.backup.astro.mjs","\u0000@astro-page:src/pages/test-upload@_@astro":"pages/test-upload.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CDzSoOCq.mjs","/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/node_modules/unstorage/drivers/netlify-blobs.mjs":"chunks/netlify-blobs_DM36vZAS.mjs","/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/add-item.astro?astro&type=script&index=0&lang.ts":"_astro/add-item.astro_astro_type_script_index_0_lang.BqHCrbUW.js","/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/login.astro?astro&type=script&index=0&lang.ts":"_astro/login.astro_astro_type_script_index_0_lang.BWxg0-mp.js","/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/profile.astro?astro&type=script&index=0&lang.ts":"_astro/profile.astro_astro_type_script_index_0_lang.CMQqX_wX.js","/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/profile.backup.astro?astro&type=script&index=0&lang.ts":"_astro/profile.backup.astro_astro_type_script_index_0_lang.CMQqX_wX.js","/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/test-upload.astro?astro&type=script&index=0&lang.ts":"_astro/test-upload.astro_astro_type_script_index_0_lang.BaMg1ATv.js","/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.BCY5IgMY.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/mnt/c/Users/user/Documents/GitHub/Joverse/Inventory-Tracker/src/pages/login.astro?astro&type=script&index=0&lang.ts","const d=document.getElementById(\"loginCard\"),c=document.getElementById(\"registerCard\"),l=document.getElementById(\"showRegister\"),m=document.getElementById(\"showLogin\");l?.addEventListener(\"click\",()=>{d?.classList.add(\"hidden\"),c?.classList.remove(\"hidden\")});m?.addEventListener(\"click\",()=>{c?.classList.add(\"hidden\"),d?.classList.remove(\"hidden\")});const g=document.getElementById(\"loginForm\"),n=document.getElementById(\"loginError\");g?.addEventListener(\"submit\",async s=>{s.preventDefault(),n?.classList.add(\"hidden\");const r=document.getElementById(\"loginEmail\").value,i=document.getElementById(\"loginPassword\").value;try{const t=await fetch(\"/api/auth/login\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({email:r,password:i})}),e=await t.json();if(!t.ok)throw new Error(e.error||\"Login failed\");localStorage.setItem(\"token\",e.token),localStorage.setItem(\"user\",JSON.stringify(e.user)),window.location.href=\"/\"}catch(t){n&&(n.textContent=t.message,n.classList.remove(\"hidden\"))}});const u=document.getElementById(\"registerForm\"),o=document.getElementById(\"registerError\");u?.addEventListener(\"submit\",async s=>{s.preventDefault(),o?.classList.add(\"hidden\");const r=document.getElementById(\"registerName\").value,i=document.getElementById(\"registerEmail\").value,t=document.getElementById(\"registerPassword\").value;try{const e=await fetch(\"/api/auth/register\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({name:r,email:i,password:t})}),a=await e.json();if(!e.ok)throw new Error(a.error||\"Registration failed\");localStorage.setItem(\"token\",a.token),localStorage.setItem(\"user\",JSON.stringify(a.user)),window.location.href=\"/\"}catch(e){o&&(o.textContent=e.message,o.classList.remove(\"hidden\"))}});"]],"assets":["/_astro/add-item.BxU7JGOR.css","/favicon.ico","/favicon.svg","/images/CM-icon.png","/images/CM.png","/images/README.md","/uploads/1770835734681-colx285h3kh.png","/uploads/1770836576415-6ttlfc6k7wf.webp","/uploads/1770837180666-jlc418109s.webp","/uploads/1770837736542-twvbt4ymmfq.png","/uploads/1771016343433-avcy9egvo2k.jpg","/uploads/1771017150445-ywgr1tkbrv.jpg","/uploads/1771017231055-caxf9931vwv.jfif","/uploads/1771018335189-71xl8hiwwz6.png","/_astro/add-item.astro_astro_type_script_index_0_lang.BqHCrbUW.js","/_astro/api.9R5FIG9q.js","/_astro/index.astro_astro_type_script_index_0_lang.BCY5IgMY.js","/_astro/middleware.0OH_Q2Eu.js","/_astro/profile.astro_astro_type_script_index_0_lang.CMQqX_wX.js","/_astro/profile.backup.astro_astro_type_script_index_0_lang.CMQqX_wX.js","/_astro/test-upload.astro_astro_type_script_index_0_lang.BaMg1ATv.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"AwOQ5wD7aKzqRLMNen9Yciw013lraE3bWEQCmYAeSjs=","sessionConfig":{"driver":"netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/netlify-blobs_DM36vZAS.mjs');

export { manifest };
