import jwt from "jsonwebtoken";
import process from "process";

const authMail = (req, res, next) => {
  const token = req.query.token;
  console.log("Token received:", token);
  if (!token) {
    return res.status(400).json({ error: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.decodedToken = decoded;
    console.log("Token decoded:", decoded);
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(400).json({ error: "Invalid token" });
  }
};

export default authMail;
