export const attachUser = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
