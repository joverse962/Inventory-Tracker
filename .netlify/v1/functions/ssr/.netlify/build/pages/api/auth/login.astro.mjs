import { c as connectDB, U as User } from '../../../chunks/User_BLlVgDOh.mjs';
import { g as generateToken } from '../../../chunks/auth_l3-FfN1f.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const token = generateToken(user);
    return new Response(
      JSON.stringify({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Login failed" }),
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
