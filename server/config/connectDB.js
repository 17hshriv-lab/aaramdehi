import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const url = process.env.MONGODB_URI;
        console.log("🔗 Connection Attempting with URL:", url.split('@')[1]); // Security ke liye password hide karke log karega

        await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log("✅ Connected to MongoDB Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;