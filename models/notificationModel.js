import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    role: { type: String},
    userEmail: { type: String },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
});

notificationSchema.index({ readAt: 1 }, { expireAfterSeconds: 18000 });

const notificationModel = mongoose.models.notifications || mongoose.model("notifications", notificationSchema);
export default notificationModel;