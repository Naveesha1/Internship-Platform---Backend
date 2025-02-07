import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userCv: { type: String, required:true },
    position: { type: String, required: true },
    companyName: { type: String },
    companyEmail: { type: String },
    internshipId: { type: String },
    status: { type: Boolean, default: false },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
});

const applyInternshipModel =
    mongoose.models.application || mongoose.model("application", applicationSchema);
export default applyInternshipModel;
