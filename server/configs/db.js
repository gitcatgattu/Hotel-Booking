// const mongoose=require('mongoose')
import mongoose from 'mongoose'

const connectDB=async ()=>{
  try{
    mongoose.connection.on('connected',()=>console.log("DB connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`)
  }catch(err){
    console.log(err.message)
  }
}

// module.exports=
export default connectDB