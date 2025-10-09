import User from "../models/User.js";

export const getUserData = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      role: user.role || "user",
      recentSearchedCities: user.recentSearchedCities || [],
    });
  } catch (err) {
    console.error("❌ getUserData error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Store recent searched cities
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    const user = req.user;

    if (!user.recentSearchedCities) user.recentSearchedCities = [];

    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchedCity);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity);
    }

    await user.save();

    res.json({
      success: true,
      message: "City added",
      recentSearchedCities: user.recentSearchedCities,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
