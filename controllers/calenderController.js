import calenderModel from "../models/calenderModel.js";

const addEventController = async (req, res) => {
  const { userEmail, reminderText, status, date } = req.body;

  try {
    let eventProfile = await calenderModel.findOne({ userEmail });

    if (!eventProfile) {
      // Create a new profile with an events array
      eventProfile = new calenderModel({
        userEmail,
        events: [{ reminderText, status, date }],
      });
      await eventProfile.save();
      return res.json({
        success: true,
        message: "Event profile created and saved",
      });
    } else {
      // Push new event into the existing events array
      await calenderModel.findOneAndUpdate(
        { userEmail },
        { $push: { events: { reminderText, status, date } } }, // Correctly pushing into the array
        { new: true }
      );
      return res.json({ success: true, message: "Event added" });
    }
  } catch (error) {
    console.error("Error adding event:", error);
    return res.json({ success: false, message: "An error occurred" });
  }
};

const getEventsController = async (req, res) => {
  const { registeredEmail } = req.body;
  try {
    const eventList = await calenderModel.findOne({
      userEmail: registeredEmail,
    });
    if (eventList) {
      return res.json({ success: true, data: eventList.events });
    } else {
      return res.json({ success: false, message: "Error fetching data" });
    }
  } catch (error) {
    return res.json({ success: false, message: "An error occured" });
  }
};

const updateEventsController = async (req, res) => {
  const { registeredEmail, reminderId } = req.body;
  try {
    const deleteEvent = await calenderModel.findOneAndUpdate(
      { userEmail: registeredEmail },
      { $pull: { events: { _id: reminderId } } },
      { new: true }
    );
    if (deleteEvent) {
      return res.json({ success: true, message: "successfully deleted" });
    } else {
      return res.json({ success: false, message: "Failed to delete" });
    }
  } catch (error) {
    return res.json({ success: false, message: "An error occured" });
  }
};

export { addEventController, getEventsController, updateEventsController };
