import jwt from 'jsonwebtoken';

const JWT_SECRET = "dev-secret-key-change-this-in-production-use-random-string";
function generateToken(user) {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
function getUserFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.substring(7);
  return verifyToken(token);
}

export { getUserFromRequest as a, generateToken as g };
