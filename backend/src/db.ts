import mongoose from "mongoose";

const connectDB = async () : Promise<void> => {
    const mongoURI = process.env.MONGO_URL;
    if (!mongoURI) {
        throw new Error("MONGO_URL is not defined in environment variables");
    }
    try {
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(error : unknown){
        if(error instanceof Error){
            console.log("MongoDB connection error:", error.message);
            process.exit(1);
        }else{
            console.log("An unknown error occurred during MongoDB connection.");
        }
        process.exit(1);
    }
}
export default connectDB;