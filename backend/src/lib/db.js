import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const uri=process.env.MONGO_URI
export const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(uri)
        console.log("connected to MongoDB")
    } catch (error) {
        console.log(error)
    }

}