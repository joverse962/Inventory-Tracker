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
    if (item.status !== "borrowed") {
      return new Response(
        JSON.stringify({ error: "Item is not borrowed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const borrowerId = item.borrowedBy?.toString();
    if (borrowerId !== currentUser.userId) {
      return new Response(
        JSON.stringify({ error: "You are not allowed to return this item" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
    item.status = "available";
    item.borrowedBy = void 0;
    item.borrowedAt = void 0;
    await item.save();
    if (borrowerId) {
      await User.findByIdAndUpdate(borrowerId, {
        $pull: { borrowedItems: item._id }
      });
    }
    return new Response(
      JSON.stringify({ item, message: "Item returned successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Return item error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to return item" }),
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
