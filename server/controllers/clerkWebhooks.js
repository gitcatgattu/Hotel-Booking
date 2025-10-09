// controllers/clerkWebhooks.js
import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify event
    const event = await webhook.verify(JSON.stringify(req.body), headers);
    console.log("✅ Verified Clerk event:", event.type);

    const { type, data } = event; // use verified event (not req.body)

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: data.email_addresses?.[0]?.email_address || "",
          image: data.image_url || "",
          recentSearchedCities: ["new"],
        };
        await User.create(userData);
        console.log("🆕 User created:", userData.email);
        break;
      }

      case "user.updated": {
        const userData = {
          username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: data.email_addresses?.[0]?.email_address || "",
          image: data.image_url || "",
        };
        await User.findOneAndUpdate({ _id: data.id }, userData);
        console.log("♻️ User updated:", data.id);
        break;
      }

      case "user.deleted": {
        await User.findOneAndDelete({ _id: data.id });
        console.log("🗑️ User deleted:", data.id);
        break;
      }

      default:
        console.log("⚠️ Unhandled event type:", type);
        break;
    }

    res
      .status(200)
      .json({ success: true, message: "Webhook processed successfully" });
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.status(400).json({ success: false, message: "Webhook failed" });
  }
};

export default clerkWebhooks;
