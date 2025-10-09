import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// Register hotel
export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id.toString(); // string

    const existingHotel = await Hotel.findOne({ owner });
    if (existingHotel) return res.status(400).json({ success: false, message: "Hotel already registered" });

    const hotel = await Hotel.create({ name, address, contact, city, owner });

    await User.findByIdAndUpdate(req.user._id, { role: "hotelOwner" });

    res.json({ success: true, message: "Hotel registered successfully", hotel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
