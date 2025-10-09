import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const payload = req.body; // raw buffer from server.js

    const event = await wh.verify(payload, headers);
    console.log("Verified event:", event.type);

    const { type, data } = event;

    const userData = {
      clerkId: data.id,
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      email: data.email_addresses?.[0]?.email_address || "",
      image: data.image_url || "",
      recentSearchedCities: ["new"],
    };
    
    switch (type) {
      case "user.created":
        const userid=await User.create(userData);
        
        // req.id=userid._id.toString()
        // console.log("user created with id",req.id)
        break;
      case "user.deleted":
        await User.findOneAndDelete({ clerkId: data.id });
        break;
      case "user.updated":
        await User.findOneAndUpdate({ clerkId: data.id }, userData);
        break;
      default:
        console.log("Unhandled event type:", type);
        break;
    }
console.log(req.user.id)

    res.status(200).json({ success: true, message: "Webhook processed" });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).json({ success: false, message: "Webhook failed" });
  }
};

export default clerkWebhooks;
