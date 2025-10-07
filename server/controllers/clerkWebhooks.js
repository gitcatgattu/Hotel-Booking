// webhooks.js
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

    const payload = req.body; // Buffer
    const event = await wh.verify(payload, headers);

    console.log("Verified event:", event);

    const { type, data } = event;

    const userData = {
      clerkId: data.id,
      username: `${data.first_name} ${data.last_name}`,
      email: data.email_addresses?.[0]?.email_address || "",
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;
      case "user.deleted":
        await User.findOneAndDelete({ clerkId: data.id });
        break;
      case "user.updated":
        await User.findOneAndUpdate({ clerkId: data.id }, userData);
        break;
      default:
        console.log("Unhandled event type:", type);
    }

    res.json({ success: true, message: "Webhook received" });
  } catch (err) {
    console.log("Webhook error:", err.message);
    res.status(400).json({ success: false, message: "Webhook failed" });
  }
};

export default clerkWebhooks;
