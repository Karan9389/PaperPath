import mongoose from "mongoose";
import dns from "dns";

mongoose.set("bufferCommands", false);

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_DB_URL || process.env.MONGODB_URI;

        if (!mongoUrl) {
            console.warn("[DB] No MongoDB connection string configured. Starting in demo mode.");
            return { connected: false };
        }

        if (mongoUrl.startsWith("mongodb+srv://")) {
            const servers = dns.getServers();
            if (servers.length === 1 && servers[0] === "127.0.0.1") {
                dns.setServers(["8.8.8.8", "8.8.4.4"]);
            }
        }

        await mongoose.connect(mongoUrl, { family: 4, serverSelectionTimeoutMS: 5000 });
        console.log("Databse connected successfully");
        return { connected: true };
    } catch (error) {
        console.warn(`[DB] Connection failed: ${error.message}. Starting in demo mode.`);
        return { connected: false };
    }
};

export default connectDB;