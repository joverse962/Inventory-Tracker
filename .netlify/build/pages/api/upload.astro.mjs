import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { a as getUserFromRequest } from '../../chunks/auth_l3-FfN1f.mjs';
export { renderers } from '../../renderers.mjs';

const UPLOAD_DIR = "./public/uploads";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const POST = async ({ request }) => {
  try {
    const currentUser = getUserFromRequest(request);
    if (!currentUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: "File size exceeds 5MB limit" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: "Only JPEG, PNG, and WebP images are allowed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
    }
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = file.name.split(".").pop();
    const filename = `${timestamp}-${randomString}.${ext}`;
    const filepath = join(UPLOAD_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);
    const url = `/uploads/${filename}`;
    console.log("File uploaded successfully:", { url, filename, size: file.size });
    return new Response(
      JSON.stringify({ url, filename }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({ error: "File upload failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
