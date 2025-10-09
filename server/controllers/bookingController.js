import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// Check room availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { hotelId, roomId, checkInDate, checkOutDate } = req.body;

    const bookings = await Booking.find({
      hotel: hotelId,
      room: roomId,
      $or: [
        { checkInDate: { $lte: new Date(checkOutDate), $gte: new Date(checkInDate) } },
        { checkOutDate: { $gte: new Date(checkInDate), $lte: new Date(checkOutDate) } },
      ],
    });

    const isAvailable = bookings.length === 0;
    res.json({ success: true, isAvailable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create a booking
export const createBooking = async (req, res) => {
  try {
    const { hotel, room, checkInDate, checkOutDate, totalPrice, guests, paymentMethod } = req.body;

    const booking = await Booking.create({
      user: req.user._id.toString(),
      hotel,
      room,
      checkInDate,
      checkOutDate,
      totalPrice,
      guests,
      paymentMethod: paymentMethod || "Pay At Hotel",
    });

    res.json({ success: true, message: "Booking created successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id.toString() });
    res.json({ success: true, bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get hotel bookings (for owner)
export const getHotelBookings = async (req, res) => {
  try {
    const owner = req.user._id.toString();
    const hotel = await Hotel.findOne({ owner });
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

    const dashboardData = await Booking.find({ hotel: hotel._id.toString() });
    console.log("printing dashboardData",dashboardData)
    res.json({ success: true, dashboardData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
