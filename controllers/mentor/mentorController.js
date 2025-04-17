import MentorProfileModel from "../../models/mentor/mentorProfileModel.js";
import UserModel from "../../models/userModel.js";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const createNewMentorController = async (req, res) => {
  const { name, position, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const mentor = await UserModel.findOne({ email: email });
    if(mentor){
      return res.json({success:false, message:"Mentor already exists!"});
    }
    else {
    const newAdmin = new UserModel({
      name: name,
      position: position,
      email: email,
      password: hashedPassword,
      role: "Mentor",
    });
    await newAdmin.save();
    return res.json({ success: true, message: "Mentor created successfully!" });
   }
  } catch (error) {
    console.log(error);

    return res.json({ success: false, message: "An error occured!" });
  }
};

const getMentorProfileController = async (req, res) => {
  const { registeredEmail } = req.body;
  try {
    const getProfile = await UserModel.findOne({ email: registeredEmail });
    if (getProfile) {
      return res.json({ success: true, data: getProfile });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    return res.json({ success: false });
  }
};

const deleteMentorController = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await UserModel.deleteOne({ email: email });
    if (result.deletedCount > 0) {
      return res.json({ success: true, message: "Successfully Deleted!" });
    } else {
      return res.json({ success: false, message: "Failed to Delete!" });
    }
  } catch (error) {
    return res.json({ success: false, message: "An error occured" });
  }
};

const getMentorProfile = async (req, res) => {
  const { registeredEmail } = req.body;
  try {
    const profile = await MentorProfileModel.findOne({ registeredEmail });
    if (!profile) {
      return res.json({
        success: false,
        message: "Mentor details not available!",
      });
    } else {
      return res.json({ success: true, data: profile });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "An unexpected error occured!",
    });
  }
};

const getAllMentorProfilesController = async (req, res) => {
  try {
    const profiles = await UserModel.find({ role: "Mentor" });
    if (profiles) {
      return res.json({ success: true, data: profiles });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    return res.json({ success: false });
  }
};

const saveMonthlyReportData = async (req, res) => {
  const { registeredEmail, name, index, reportUrl, month } = req.body;
  try {
    const profile = await MentorProfileModel.findOne({ registeredEmail });
    console.log(profile);
    if (profile) {
      const newMonthlyData = {
        month: month,
        name: name,
        index: index,
        reportUrl: reportUrl,
      };
      profile.monthly.push(newMonthlyData);
      await profile.save();
      return res.json({
        success: true,
        message: "Data saved",
      });
    }
  } catch (error) {
    return res.json({ success: false, message: error });
  }
};

const getMonthlyReports = async (req, res) => {
  const { userEmail } = req.body;
  try {
    const profile = await MentorProfileModel.findOne({
      registeredEmail: userEmail,
    });
    if (profile) {
      return res.json({ success: true, data: profile.monthly });
    }
  } catch (error) {
    return res.json({ success: false, message: error });
  }
};

const deleteMonthlyReport = async (req, res) => {
  const { userEmail, reportId } = req.body; // Use reportId here as passed from the frontend
  try {
    // Convert reportId to ObjectId
    const reportIdObject = mongoose.Types.ObjectId(reportId);

    const Profile = await MentorProfileModel.findOneAndUpdate(
      { registeredEmail: userEmail },
      { $pull: { monthly: { _id: reportIdObject } } },
      { new: true }
    );

    if (!Profile) {
      return res.json({ success: false, message: "Profile not found" });
    }

    return res.json({
      success: true,
      message: "Successfully deleted",
      data: Profile.monthly,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "An unexpected error occurred!",
    });
  }
};

export {
  createNewMentorController,
  getMentorProfileController,
  getAllMentorProfilesController,
  deleteMentorController,
  getMentorProfile,
  saveMonthlyReportData,
  getMonthlyReports,
  deleteMonthlyReport,
};
