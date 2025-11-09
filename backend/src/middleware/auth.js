
import jwt from "jsonwebtoken";


export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
    const token = bearer || req.cookies?.accessToken;  

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: payload.sub }; 
    next();
  } catch (_err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
