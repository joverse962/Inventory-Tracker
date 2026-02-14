import { c as connectDB, U as User } from '../../../chunks/User_BLlVgDOh.mjs';
import { a as getUserFromRequest } from '../../../chunks/auth_l3-FfN1f.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request }) => {
  try {
    await connectDB();
    const currentUser = getUserFromRequest(request);
    if (!currentUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const user = await User.findById(currentUser.userId).select("-password").populate("borrowedItems");
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Get user error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get user data" }),
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
