import notificationModel from "../models/notificationModel.js";

const createNotificationController = async (req, res) => {
    const { role, userEmail, message, isRead } = req.body;
    try {
         const newNotification = new notificationModel({
                role:role,
                userEmail:userEmail,
                message:message,
                isRead:isRead,
              });
        await newNotification.save();
        return res.json({ success: true, message: "Notification saved successfully" });
    } catch (error) {
        return res.json({ success:false, message: "Error in saving notifications" });
    }
}

const getAdminNotificationController = async (req,res) => {
    const { role } = req.body;
    try {
        const notifications = await notificationModel.find({ role: role });
        if (notifications) {
            return res.json({ success: true, data: notifications });
        } else {
            return res.json({ success: false, message: "No notifications found" });
        }
    } catch (error) {
        return res.json({ success: false, message: "Error in fetching notifications" });
    }
}

const getMentorNotificationsController = async (req,res) => {
    const { mentor } = req.body;
    try {
        const notifications = await notificationModel.find({ role: mentor });
        if (notifications) {
            return res.json({ success: true, data: notifications });
        } else {
            return res.json({ success: false, message: "No notifications found" });
        }
    } catch (error) {
        return res.json({ success: false, message: "Error in fetching notifications" });
    }
}

const getNotificationsController = async (req,res) => {
    const { registeredEmail } = req.body;
    try {
        const notifications = await notificationModel.find({ userEmail: registeredEmail });
        if (notifications) {
            return res.json({ success: true, data: notifications });
        } else {
            return res.json({ success: false, message: "No notifications found" });
        }
    } catch (error) {
        return res.json({ success: false, message: "Error in fetching notifications" });
        
    }
}

const changeNotificationStatusController = async (req, res) => {
    const { notificationId } = req.body;
    try {
        const notification = await notificationModel.findById(notificationId);
        if (notification) {
            notification.isRead = true;
            notification.readAt = new Date();
            await notification.save();
            return res.json({ success: true, message: "Mark as read" });
        } else {
            return res.json({ success: false, message: "Notification not found" });
        }
    } catch (error) {
        return res.json({ success: false, message: "Error in updating notification status" });
    }
}

const markAllAsReadController = async (req, res) => {
    const { notificationIds } = req.body;
    try {
        const notifications = await notificationModel.updateMany(
            { _id: { $in: notificationIds } },
            { isRead: true, readAt: new Date() }
        );
        if (notifications) {
            return res.json({ success: true, message: "All notifications marked as read" });
        } else {
            return res.json({ success: false, message: "No notifications found" });
        }
    } catch (error) {
        return res.json({ success: false, message: "Error in marking all notifications as read" });
    }
}

export { createNotificationController,
         getAdminNotificationController,
         changeNotificationStatusController,
         markAllAsReadController,
         getNotificationsController,
         getMentorNotificationsController,
    };