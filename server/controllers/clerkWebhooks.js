const user=require("../models/User")
const {Webhook} = require('svix')

const clerkWebhooks=async (req,res)=>{
  try{
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const headers={
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature']
    }
    const event =await wh.verify(JSON.stringify(req.body), headers);
    //get data
    const {data,eventType}=req.body
    const userData={
      _id:data.id,
      username:data.first_name+" "+data.last_name,
      email:data.emailAddresses[0].emailAddress,
      image:data.image_url,
      recentSearchedCities:""
    }
    switch(eventType){
      case "user.created":
        //add user to db
        const newUser=new user(userData)
        await newUser.save()
        break;
      case "user.deleted":
        //delete user from db
        await user.findByIdAndDelete(data.id)
        break;
      case "user.updated":
        //update user in db
        await user.findByIdAndUpdate(data.id,userData)
        break;
      default:
        console.log("Unhandled event type:", eventType);    
    }
    res.json({succes:true,message:"Webhook received"})
  }catch(err){
    console.log(err.message)
    res.status(400).json({succes:false,message:"Webhook failed"})
  }
}
module.exports=clerkWebhooks