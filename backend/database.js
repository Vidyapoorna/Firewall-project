import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
const uri=process.env.SERVER_MONGO_URI

const connectDB = async () =>{
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    }
    catch (err) {
        console.error("cannot connect to mongodb",err.message);
    }
} 

export default connectDB;