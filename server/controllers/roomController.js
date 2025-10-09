import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

// Create a room
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const owner = req.user._id.toString();

    const hotel = await Hotel.findOne({ owner });
    if (!hotel) return res.status(404).json({ success: false, message: "No hotel found" });

    const uploadImages = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url;
    });
    const images = await Promise.all(uploadImages);

    const room = await Room.create({
      hotel: hotel._id.toString(),
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    res.json({ success: true, message: "Room created successfully", room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all available rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    console.log("printing available rooms",rooms)
    res.json({ success: true, rooms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get rooms for owner's hotel
export const getOwnerRooms = async (req, res) => {
  try {
    const owner = req.user._id.toString();
    const hotel = await Hotel.findOne({ owner });
    if (!hotel) return res.status(404).json({ success: false, message: "No hotel found" });

    const rooms = await Room.find({ hotel: hotel._id.toString() });
    res.json({ success: true, rooms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Toggle room availability
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });

    room.isAvailable = !room.isAvailable;
    await room.save();

    res.json({ success: true, message: "Room availability updated", room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
