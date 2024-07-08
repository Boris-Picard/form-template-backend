import jwt from "jsonwebtoken";
import process from "process";

const authMail = (req, res, next) => {
  const { token } = req.query.token;

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.decodedToken = decoded
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

export default authMail;
