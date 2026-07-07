import mongoose from "mongoose";
import dns from "dns";

mongoose.set("bufferCommands", false);

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_DB_URL;
        if (!mongoUrl) {
            throw new Error("MONGO_DB_URL is not defined in the environment variables.");
        }

        if (mongoUrl.startsWith("mongodb+srv://")) {
            const servers = dns.getServers();
            if (servers.length === 1 && servers[0] === "127.0.0.1") {
                dns.setServers(["8.8.8.8", "8.8.4.4"]);
            }
        }

        await mongoose.connect(mongoUrl, {
            family: 4,
            serverSelectionTimeoutMS: 10000,
        });

        console.log("Database connected successfully");
        return true;
    } catch (error) {
        console.warn(`MongoDB connection failed: ${error.message}`);
        return false;
    }
};

export default connectDB;