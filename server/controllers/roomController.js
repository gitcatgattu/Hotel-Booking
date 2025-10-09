// controllers/roomController.js
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

// ======================
// 1️⃣ Create a room
// ======================
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    // Clerk middleware attaches req.user
    const ownerId = req.user._id.toString();

    // Ensure the user owns a hotel
    const hotel = await Hotel.findOne({ owner: ownerId });
    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "No hotel found for this owner" });

    // Upload all images to Cloudinary
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "hotel_rooms",
        });
        return result.secure_url;
      })
    );

    // Create room in MongoDB
    const room = await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities:
        typeof amenities === "string" ? JSON.parse(amenities) : amenities,
      images: uploadedImages,
      isAvailable: true,
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (err) {
    console.error("❌ createRoom error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================
// 2️⃣ Get all available rooms (public)
// ======================
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true }).populate(
      "hotel",
      "name city"
    );
    res.json({ success: true, count: rooms.length, rooms });
  } catch (err) {
    console.error("❌ getRooms error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================
// 3️⃣ Get rooms owned by logged-in user
// ======================
export const getOwnerRooms = async (req, res) => {
  try {
    console.log("Owner user", req.user);
    const ownerId = req.user._id.toString();

    const hotel = await Hotel.findOne({ owner: ownerId });
    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "No hotel found for this owner" });

    const rooms = await Room.find({ hotel: hotel._id });
    res.json({ success: true, count: rooms.length, rooms });
  } catch (err) {
    console.error("❌ getOwnerRooms error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================
// 4️⃣ Toggle room availability
// ======================
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId)
      return res
        .status(400)
        .json({ success: false, message: "Room ID required" });

    const room = await Room.findById(roomId);
    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });

    room.isAvailable = !room.isAvailable;
    await room.save();

    res.json({
      success: true,
      message: `Room is now ${room.isAvailable ? "available" : "unavailable"}`,
      room,
    });
  } catch (err) {
    console.error("❌ toggleRoomAvailability error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
