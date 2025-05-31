import notificationModel from "../models/notificationModel.js";
import calenderModel from "../models/calenderModel.js";

const createNotificationController = async (req, res) => {
  const { role, userEmail, message, isRead } = req.body;
  try {
    const newNotification = new notificationModel({
      role: role,
      userEmail: userEmail,
      message: message,
      isRead: isRead,
    });
    await newNotification.save();
    return res.json({
      success: true,
      message: "Notification saved successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error in saving notifications",
    });
  }
};

const getAdminNotificationController = async (req, res) => {
  const { role, registeredEmail } = req.body;

  try {
    // Fetch calendar events for the user
    const calendarData = await calenderModel.findOne({
      userEmail: registeredEmail,
    });

    // Prepare today's date (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let reminderMessage = null;

    if (calendarData && calendarData.events.length > 0) {
      for (const event of calendarData.events) {
        const eventDateStr = event.date; // 'YYYY-MM-DD' format
        const eventDate = new Date(eventDateStr);
        eventDate.setHours(0, 0, 0, 0);

        const diffTime = eventDate - today;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 2) {
          reminderMessage = `You have an upcoming event on ${eventDateStr}`;
          break;
        } else if (diffDays === 1) {
          reminderMessage = `You have an event tomorrow`;
          break;
        }
      }

      // Save notification only if message is present and not duplicated
      if (reminderMessage) {
        const existing = await notificationModel.findOne({
          role: "Admin",
          message: reminderMessage,
        });

        if (!existing) {
          const newNotification = new notificationModel({
            role: "Admin",
            message: reminderMessage,
            isRead: false,
          });
          await newNotification.save();
        }
      }
    }

    // Fetch all notifications for the admin role
    const notifications = await notificationModel.find({ role: role });

    return res.json({ success: true, data: notifications });
  } catch (error) {
    console.error("Error fetching admin notifications:", error);
    return res.json({
      success: false,
      message: "Error in fetching notifications",
    });
  }
};

const getMentorNotificationsController = async (req, res) => { 
  const { mentor, registeredEmail } = req.body;
  try {
    const calendarData = await calenderModel.findOne({
      userEmail: registeredEmail,
    });
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    let reminderMessage = null;
    
    if (calendarData && calendarData.events.length > 0) {
      for (const event of calendarData.events) {
        const eventDateStr = event.date;

        const eventDate = new Date(eventDateStr);
        eventDate.setHours(0, 0, 0, 0);

        const diffTime = eventDate - today;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 2) {
          reminderMessage = `You have an upcoming event on ${eventDateStr}`;
          break;
        } else if (diffDays === 1) {
          reminderMessage = `You have an event tomorrow`;
          break;
        }
      }

      if (reminderMessage) {
        const existing = await notificationModel.findOne({
          role: "Mentor",
          message: reminderMessage,
        });

        if (!existing) {
          const newNotification = new notificationModel({
            role: "Mentor",
            userEmail: registeredEmail,
            message: reminderMessage,
            isRead: false,
          });
          await newNotification.save();
        }
      }
    }

    const notifications = await notificationModel.find({ userEmail: registeredEmail, role:mentor });
    if (notifications.length > 0) {
      return res.json({ success: true, data: notifications });
    } else {
      return res.json({ success: false, message: "No notifications found" });
    }
  } catch (error) {
    console.error("Error fetching mentor notifications:", error);
    return res.json({
      success: false,
      message: "Error in fetching notifications",
    });
  }
};

const getNotificationsController = async (req, res) => {
  const { role, registeredEmail } = req.body;
  try {
    const calendarData = await calenderModel.findOne({
      userEmail: registeredEmail,
    });

    // Prepare today's date in YYYY-MM-DD format
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (calendarData && calendarData.events.length > 0) {
      for (const event of calendarData.events) {
        const eventDateStr = event.date; // e.g., "2025-05-28"
        const eventDate = new Date(eventDateStr);
        eventDate.setHours(0, 0, 0, 0);

        const diffTime = eventDate - today;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let reminderMessage = null;

        if (diffDays === 2) {
          reminderMessage = `You have an upcoming event on ${eventDateStr}`;
        } else if (diffDays === 1) {
          reminderMessage = `You have an event tomorrow`;
        }

        // Save notification only if message is set and doesn't already exist
        if (reminderMessage) {
          const existing = await notificationModel.findOne({
            userEmail: registeredEmail,
            message: reminderMessage,
          });

          if (!existing) {
            const newNotification = new notificationModel({
              role,
              userEmail: registeredEmail,
              message: reminderMessage,
              isRead: false,
            });
            await newNotification.save();
          }
        }
      }
    }

    const notifications = await notificationModel.find({
      userEmail: registeredEmail,
    });

    if (notifications.length > 0) {
      return res.json({ success: true, data: notifications });
    } else {
      return res.json({ success: false, message: "No notifications found" });
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.json({
      success: false,
      message: "Error in fetching notifications",
    });
  }
};

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
    return res.json({
      success: false,
      message: "Error in updating notification status",
    });
  }
};

const markAllAsReadController = async (req, res) => {
  const { notificationIds } = req.body;
  try {
    const notifications = await notificationModel.updateMany(
      { _id: { $in: notificationIds } },
      { isRead: true, readAt: new Date() }
    );
    if (notifications) {
      return res.json({
        success: true,
        message: "All notifications marked as read",
      });
    } else {
      return res.json({ success: false, message: "No notifications found" });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Error in marking all notifications as read",
    });
  }
};

export {
  createNotificationController,
  getAdminNotificationController,
  changeNotificationStatusController,
  markAllAsReadController,
  getNotificationsController,
  getMentorNotificationsController,
};
