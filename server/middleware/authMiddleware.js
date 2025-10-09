// middleware/protect.js
import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Step 1: Use Clerk's built-in middleware to verify token
    await new Promise((resolve, reject) => {
      requireAuth()(req, res, (err) => (err ? reject(err) : resolve()));
    });

    // Step 2: Clerk verified the token successfully
    const clerkUserId = req.auth.userId; // available after requireAuth()

    // Step 3: Fetch your app’s user data from MongoDB
    const user = await User.findById(clerkUserId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found in MongoDB" });
    }

    // Step 4: Attach to request
    req.user = user;
    console.log("Middleware user: ", req.user);
    next();
  } catch (error) {
    console.error("❌ protect middleware error:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
