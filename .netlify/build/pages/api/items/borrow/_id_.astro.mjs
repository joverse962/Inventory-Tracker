import { c as connectDB, U as User } from '../../../../chunks/User_BLlVgDOh.mjs';
import { I as Item } from '../../../../chunks/Item_ByCTOhxX.mjs';
import { a as getUserFromRequest } from '../../../../chunks/auth_l3-FfN1f.mjs';
export { renderers } from '../../../../renderers.mjs';

const POST = async ({ params, request }) => {
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
    if (item.status !== "available") {
      return new Response(
        JSON.stringify({ error: "Item is not available for borrowing" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    item.status = "borrowed";
    item.borrowedBy = currentUser.userId;
    item.borrowedAt = /* @__PURE__ */ new Date();
    await item.save();
    await User.findByIdAndUpdate(currentUser.userId, {
      $addToSet: { borrowedItems: item._id }
    });
    await item.populate("borrowedBy", "name email");
    return new Response(
      JSON.stringify({ item, message: "Item borrowed successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Borrow item error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to borrow item" }),
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
