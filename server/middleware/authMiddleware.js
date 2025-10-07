import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    console.log("Came to protect middleware");

    const { userId } = req.auth; // Clerk attaches this automatically

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
