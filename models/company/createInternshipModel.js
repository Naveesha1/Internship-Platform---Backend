import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
    position: { type: String, required: true },
    jobType: { type: String, required: true },
    workMode: { type: String, required: true },
    responsibilities: [{ type: String, required: true }],
    requirements: [{ type: String, required: true }],
    keywords: [{ type: String, required: true }],
    registeredEmail: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    companyName: { type: String },
    companyLogo: { type: String },
    companyEmail: { type: String },
    location: { type: String },
    aboutIntern: { type: String },
    rating: { type: Number },
    industry: { type: String },
    contactNumber: { type: String },
    verify: { type: Boolean, default: false },
});

const createInternshipModel =
    mongoose.models.internships || mongoose.model("internships", internshipSchema);
export default createInternshipModel;
