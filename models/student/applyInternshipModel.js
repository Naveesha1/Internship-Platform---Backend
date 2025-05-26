import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userCv: { type: String, required: true },
  userGpa: { type: String },
  position: { type: String, required: true },
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  companyRegisteredEmail: { type: String },
  internshipId: { type: String },
  status: { type: Boolean, default: null },
  isHired: { type: Boolean, default: null },
  date: { type: String, default: () => new Date().toISOString().split("T")[0] },
});

const applyInternshipModel =
  mongoose.models.application ||
  mongoose.model("application", applicationSchema);
export default applyInternshipModel;
