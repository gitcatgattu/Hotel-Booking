const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
const { clerkMiddleware } = require('@clerk/express');
const connectDB=require('./configs/db');
const clerkWebhooks = require('./controllers/clerkWebhooks');
connectDB()
const app=express();
const PORT=process.env.PORT||5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())
app.use('/api/clerk',clerkWebhooks)
app.get('/',(req,res)=>{
    res.send('Hello World!');
});

// MongoDB connection


// Start server
app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
});

