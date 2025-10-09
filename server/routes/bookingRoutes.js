import express from "express";
import {
  checkAvailabilityAPI,
  createBooking,
  getUserBookings,
  getHotelBookings,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/check-availability", protect, checkAvailabilityAPI);
router.post("/book", protect, createBooking);
router.get("/user", protect, getUserBookings);
router.get("/hotel", protect, getHotelBookings);

export default router;
