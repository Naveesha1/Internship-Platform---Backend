import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        fullName: { type: String, required:true },
        registrationNumber: { type: String, required:true },
        degree: { type: String, required:true },
        universityMail: { type: String, required:true },
        contactNumber: { type: String, required:true },
        gpa: { type: Number, required:true, min: 0.0, max:4.0 },
        profileImageUrl: { type: String, required:true },
        idFrontImageUrl: { type: String, required:true },
        idBackImageUrl: { type: String, required:true },
        skills: [{ type: String }],
        position: [{ type:String, required:true }],
        qualification: [{ type:String }],
        cvUrl: { type:String },
        verify: { type: Boolean, default:false },
        registeredEmail:{ type:String, required:true},
        date: { type: String, default: () => new Date().toISOString().split('T')[0] },
        certifications:[{ type:String, required:true}]
    },
    {
        minimize:false
    }
)

const studentProfileModel = mongoose.model.students || mongoose.model("students", profileSchema);
export default studentProfileModel;