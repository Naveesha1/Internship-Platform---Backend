import MentorProfileModel from "../../models/mentor/mentorProfileModel.js";
import mongoose from 'mongoose';


const createProfile = async (req, res) => {
  const { mentorName, position, address, contactNumber, registeredEmail } =
    req.body;
  try {
    const profile = await MentorProfileModel.findOne({ registeredEmail });
    if (profile) {
      return res.json({ success: false, message: "Mentor details exsists!" });
    } else {
      const newMentor = new MentorProfileModel({
        name: mentorName,
        address: address,
        contactNumber: contactNumber,
        position: position,
        registeredEmail: registeredEmail,
      });
      await newMentor.save();
      return res.json({ success: true, message: "Data saved succeessfully!" });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "An unexpected error occured!",
    });
  }
};

const getMentorProfile = async(req,res) => {
    const { registeredEmail } = req.body;
    try {
        const profile = await MentorProfileModel.findOne({registeredEmail});
        if(!profile){
            return res.json({success:false, message:"Mentor details not available!"});
        }
        else {
            return res.json({success:true, data:profile});
        }
    } catch (error) {
        return res.json({success:false, message:"An unexpected error occured!"})
    }
};

const saveMonthlyReportData = async (req, res) => {
  const { registeredEmail, name,index, reportUrl, month } = req.body;
  try {
    const profile = await MentorProfileModel.findOne({ registeredEmail });
    console.log(profile);
    if (profile) {
      const newMonthlyData = {
        month: month,
        name:name,
        index:index,
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
  createProfile,
  getMentorProfile,
  saveMonthlyReportData,
  getMonthlyReports,
  deleteMonthlyReport,

};
