import mongoose from "mongoose";
import { getConfig } from "../../config/env";

let isConnected = false;

export async function connectMongo(): Promise<void> {
    if (isConnected) {
        return;
    }

    const config = getConfig();

    await mongoose.connect(config.mongoUri);
    isConnected = true;
    console.log("MongoDB connection OK");
}