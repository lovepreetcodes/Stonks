import mongoose from "mongoose";

const connectToMongoDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo DB connected")
    }
    catch(error){
console.log("error")
    }
}

export default connectToMongoDB