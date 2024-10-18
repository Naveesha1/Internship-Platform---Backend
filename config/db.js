import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://internshipNexus:internNX@cluster0.pug4n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>console.log("DB connected"));
}


//mongodb+srv://manoj:manoj@testdatabase.e058spu.mongodb.net/intern-app



