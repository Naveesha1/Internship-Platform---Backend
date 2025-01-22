//mongodb+srv://manoj:<db_password>@testdatabase.e058spu.mongodb.net/?retryWrites=true&w=majority&appName=testDatabase
//mongodb+srv://manoj:<db_password>@internshipnexus.or16u.mongodb.net/?retryWrites=true&w=majority&appName=InternshipNexus

import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://manoj:Manoj@internshipnexus.or16u.mongodb.net/?retryWrites=true&w=majority&appName=InternshipNexus");
        console.log("DB connected");

        // Listen for connection lost events
        mongoose.connection.once("disconnected", () => {
            console.log("DB disconnected");
        });
        
    } catch (error) {
        console.error("DB connection error:", error);
    }
};

