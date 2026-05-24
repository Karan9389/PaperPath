import mongoose from "mongoose";

const connectDB = async () =>{
    try{
        const conn = await mongoose.coonect(process.env.url);
        console.log("Databse connected successfully");
    }catch(error){
        console.log(`Error ${error.message}`);
        process.exit(1);
    }
}
export default connectDB;