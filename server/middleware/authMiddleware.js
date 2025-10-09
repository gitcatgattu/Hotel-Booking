import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes middleware
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ clerkId: decoded.clerkId });
    if (!user) {
      console.log("no user")
      return res.status(401).json({ success: false, message: "User not found" });}

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Not authorized" });
  }
};
