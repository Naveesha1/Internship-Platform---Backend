import mongoose from "mongoose";

const companyProfileSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    companyLogo: { type: String },
    companyEmail: { type: String, required: true },
    companyDocument: { type: String, required: true },
    location: { type: String, required: true },
    about: { type: String, required: true },
    positions: [{ type: String, required: true }],
    vision: { type: String, required: true },
    mission: { type: String, required: true },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    rating: { type: Number, required: true },
    industry: { type: String, required: true },
    contactNumber: { type: String, required: true },
    verify: { type: Boolean, default: null },
    registeredEmail: { type: String, required: true },
    
    mentors:[{
      mentorName:{type:String, required:true},
      mentorPosition:{type:String, required:true},
      mentorEmail:{type:String, required:true},
    },  
    ]
  },
  {
    minimize: false,
  }
);

const companyProfileModel =
  mongoose.model.company || mongoose.model("company", companyProfileSchema);
export default companyProfileModel;
