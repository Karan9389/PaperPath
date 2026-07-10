import mongoose from "mongoose";
import dns from "dns";

mongoose.set("bufferCommands", false);

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_DB_URL || process.env.MONGODB_URI;

        if (!mongoUrl) {
            throw new Error("MongoDB connection string is not defined. Set MONGO_DB_URL in the .env file.");
        }

        if (mongoUrl.startsWith("mongodb+srv://")) {
            const servers = dns.getServers();
            if (servers.length === 1 && servers[0] === "127.0.0.1") {
                dns.setServers(["8.8.8.8", "8.8.4.4"]);
            }
        }

        await mongoose.connect(mongoUrl, { family: 4 });
        console.log("Databse connected successfully");
    }catch(error){
        console.log(`Error ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;