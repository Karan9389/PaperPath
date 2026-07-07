import mongoose from "mongoose";
import dns from "dns";
// This block of code is a custom utility function designed to 
// connect a Node.js application to a MongoDB database using the Mongoose 
// Object Data Modeling (ODM) library.

const connectDB = async () =>{
    try{
        const mongoUrl = process.env.MONGO_DB_URL;
        if (!mongoUrl) {
            console.warn("MONGO_DB_URL is not set. Skipping database connection.");
            return;
        }

        if (mongoUrl.startsWith("mongodb+srv://")) {
            const servers = dns.getServers();
            if (servers.length === 1 && servers[0] === "127.0.0.1") {
                dns.setServers(["8.8.8.8", "8.8.4.4"]);
            }
        }

        await mongoose.connect(mongoUrl, { family: 4 });
        console.log("Database connected successfully");
    }catch(error){
        console.error(`Database connection error: ${error.message}`);
    }
}
export default connectDB;