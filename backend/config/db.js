import mongoose from "mongoose";
import { defaultFoods } from "./storage.js";

let mongoConnected = false;

export const isMongoConnected = () => {
    return mongoConnected && mongoose.connection.readyState === 1;
};

export const connectDB = async () => {
    const customUri = process.env.MONGO_URI;
    const urisToTry = [];

    if (customUri) {
        urisToTry.push(customUri);
    }
    // Try local mongodb
    urisToTry.push("mongodb://127.0.0.1:27017/pizza-dev");

    for (const uri of urisToTry) {
        try {
            const masked = uri.includes("@") ? uri.replace(/:([^@]+)@/, ":****@") : uri;
            console.log(`Connecting to MongoDB (${masked})...`);
            await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 2500,
                connectTimeoutMS: 2500
            });
            mongoConnected = true;
            console.log("✅ MongoDB Connected successfully!");

            // Seed initial foods in MongoDB if empty
            try {
                const foodCollection = mongoose.connection.collection("foods");
                const count = await foodCollection.countDocuments();
                if (count === 0) {
                    await foodCollection.insertMany(defaultFoods);
                    console.log("✅ Initial foods seeded into MongoDB.");
                }
            } catch (seedErr) {
                console.warn("Could not check/seed foods in MongoDB:", seedErr.message);
            }
            return;
        } catch (error) {
            console.warn(`MongoDB attempt failed (${error.code || error.message})`);
        }
    }

    mongoConnected = false;
    console.log("ℹ️  Running in standalone resilient mode with local persistent storage (backend/data/db.json).");
    console.log("ℹ️  Full functionality (Auth, Menu, Cart, Orders, Admin, Inventory) is fully active and operational!");
};
