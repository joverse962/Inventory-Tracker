import { c as connectDB } from '../../../../chunks/User_BLlVgDOh.mjs';
import { I as Item } from '../../../../chunks/Item_ByCTOhxX.mjs';
import { a as getUserFromRequest } from '../../../../chunks/auth_l3-FfN1f.mjs';
export { renderers } from '../../../../renderers.mjs';

const GET = async ({ params, request }) => {
  try {
    await connectDB();
    const currentUser = getUserFromRequest(request);
    if (!currentUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const item = await Item.findOne({ barcode: params.barcode }).populate("borrowedBy", "name email").populate("createdBy", "name email");
    if (!item) {
      return new Response(
        JSON.stringify({ error: "Item not found with this barcode" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ item }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Get item by barcode error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch item" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
