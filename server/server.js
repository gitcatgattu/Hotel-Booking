import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
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
// clerkWebhooks()

const app = express();
app.use(cors());

// ----------------------
// Webhook route (raw body) must come first
// ----------------------

// ----------------------
// Clerk middleware for all other routes
// ----------------------
// app.use(clerkMiddleware());

// ----------------------
// JSON parser for normal requests
// ----------------------
app.use(express.json());

// ----------------------
// Routes
// ----------------------
app.get("/api/rooms/", async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true });
    console.log("printing available rooms", rooms);
    if(!rooms){res.json({success:false})}
    else{res.json({ success: true, rooms });}
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});
app.use("/", ClerkExpressRequireAuth(), async (req, res, next) => {
  try {
    const { userId } = req.auth;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach your internal user ID to the request object
    req.user = user;

    next(); // Proceed to the next middleware or route
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post(
  "/api/clerk",
  bodyParser.raw({ type: "application/json" }),
  clerkWebhooks
);
app.get("/", (req, res) => res.send("API is working after updates"));
app.use((req, res, next) => {
  console.log(req.user);
  next();
});
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
