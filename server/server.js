import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import bodyParser from "body-parser";

import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

import connectCloudinary from "./configs/cloudinary.js";
import User from "./models/User.js";
import Room from "./models/Room.js";

connectDB();
connectCloudinary();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Webhook (must use raw parser)
app.post(
  "/api/clerk",
  bodyParser.raw({ type: "application/json" }),
  clerkWebhooks
);

// ✅ Add Clerk middleware globally
app.use(clerkMiddleware());

// ✅ Public route
app.get("/", (req, res) => res.send("API is working after updates"));
app.get("/api/rooms",async(req,res)=>{
   try {
    const rooms = await Room.find({ isAvailable: true }).populate("hotel");
    res.json({ success: true, rooms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
})

// ✅ Protected middleware to attach user
app.use(requireAuth(), async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });
    req.user = user;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }finally{
    next()
  }
});

// ✅ Routes
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

// ✅ Start server
const PORT = 3000
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
