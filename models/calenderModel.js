import mongoose from "mongoose";

const calenderEventSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  events: [
    {
      reminderText: { type: String, required: true },
      status: { type: String, required: true },
      date: { type: String, required: true },
    },
  ],
});

const calenderModel =
  mongoose.models.calenderEvent ||
  mongoose.model("calenderEvent", calenderEventSchema);
export default calenderModel;
