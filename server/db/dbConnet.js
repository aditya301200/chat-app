// Package imports
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

// Configurations
configDotenv();

const dbConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDb connected")
    } catch(err){
        console.log("Error connecting mongoDb", err.message);
    }
}

export default dbConnect;