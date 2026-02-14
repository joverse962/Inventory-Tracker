import { c as connectDB, U as User } from '../../../chunks/User_BLlVgDOh.mjs';
import { g as generateToken } from '../../../chunks/auth_l3-FfN1f.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password, name } = body;
    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: "Email, password, and name are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Email already registered" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const user = await User.create({
      email,
      password,
      name,
      role: "user"
    });
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
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({ error: "Registration failed" }),
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
