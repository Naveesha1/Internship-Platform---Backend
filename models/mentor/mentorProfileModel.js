import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    position: { type: String, required: true },
    registeredEmail: { type: String, required: true },
    company:{type: String},

    monthly: [
      {
        name: { type: String },
        index:{type:String},
        month: { type: String },
        reportUrl: { type: String },
      },
    ],
    
    weekly: [
      {
        name: { type: String },
        index:{type:String},
        weekNo: { type: Number },
        reportUrl: { type: String },
      },
    ],
    student:[
      {
        registrationNumber:{type:String},
        name:{type:String},
        email:{type:String},
        phone:{type:String},
        address:{type:String},
        startDate:{type:String},
        endDate:{type:String},
        position:{type:String},
      },
    ],

  },
  {
    minimize: false,
  }
);

const mentorProfileModel =
  mongoose.model.mentors || mongoose.model("mentors", profileSchema);
export default mentorProfileModel;
