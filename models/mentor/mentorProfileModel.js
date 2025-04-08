import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    position: { type: String, required: true },
    registeredEmail: { type: String, required: true },
  },
  {
    minimize: false,
  }
);

const mentorProfileModel =
  mongoose.model.mentors || mongoose.model("mentors", profileSchema);
export default mentorProfileModel;
