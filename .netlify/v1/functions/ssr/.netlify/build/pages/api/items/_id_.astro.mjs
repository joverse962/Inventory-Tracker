import { c as connectDB } from '../../../chunks/User_BLlVgDOh.mjs';
import { I as Item } from '../../../chunks/Item_ByCTOhxX.mjs';
import { a as getUserFromRequest } from '../../../chunks/auth_l3-FfN1f.mjs';
export { renderers } from '../../../renderers.mjs';

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
    const item = await Item.findById(params.id).populate("borrowedBy", "name email").populate("createdBy", "name email");
    if (!item) {
      return new Response(
        JSON.stringify({ error: "Item not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ item }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Get item error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch item" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const PUT = async ({ params, request }) => {
  try {
    await connectDB();
    const currentUser = getUserFromRequest(request);
    if (!currentUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const body = await request.json();
    const item = await Item.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).populate("borrowedBy", "name email").populate("createdBy", "name email");
    if (!item) {
      return new Response(
        JSON.stringify({ error: "Item not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ item }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Update item error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update item" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const DELETE = async ({ params, request }) => {
  try {
    await connectDB();
    const currentUser = getUserFromRequest(request);
    if (!currentUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const item = await Item.findById(params.id);
    if (!item) {
      return new Response(
        JSON.stringify({ error: "Item not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    if (String(item.createdBy) !== currentUser.userId) {
      return new Response(
        JSON.stringify({ error: "You are not allowed to delete this item" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
    await Item.findByIdAndDelete(params.id);
    return new Response(
      JSON.stringify({ message: "Item deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Delete item error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete item" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
