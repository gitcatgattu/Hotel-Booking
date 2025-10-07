// const user=require("../models/User")
// const {Webhook} = require('svix')
import User from "../models/User.js"
import {Webhook} from 'svix'

const clerkWebhooks=async (req,res)=>{
  try{
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const headers={
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature']
    }
    const payload=req.body
    const event = await wh.verify(payload, headers);
    //get data
    console.log("Verified event:", event);

    // Clerk sends payload as { type, data }
    const { type, data } = req.body;
    console.log("Event type:", type);
    console.log("User data:", data);

    const userData = {
      _id: data.id,
      username: `${data.first_name} ${data.last_name}`,
      email: data.email_addresses ? data.email_addresses[0].email_address : "",
      image: data.image_url,
    };
    console.log(userData)
    switch (type) {
      case "user.created": {
        // add user to db
        await User.create(userData);
        break;
      }
      case "user.deleted": {
        // delete user from db
        await User.findByIdAndDelete(data.id);
        break;
      }
      case "user.updated": {
        // update user in db
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }
      default:
        console.log("Unhandled event type:", type);
    }
    res.json({ succes: true, message: "Webhook received" });
  }catch(err){
    console.log(err.message)
    res.status(400).json({succes:false,message:"Webhook failed"})
  }
}

export default clerkWebhooks