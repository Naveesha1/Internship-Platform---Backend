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
      // Return the monthly reports as they are stored in the database
      // The frontend will handle grouping them by student
      return res.json({ success: true, data: profile.monthly });
    } else {
      return res.json({ success: false, message: "Mentor profile not found" });
    }
  } catch (error) {
    console.error("Error fetching monthly reports:", error);
    return res.json({ success: false, message: error.message });
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

// Add a student to mentor's profile
const addStudentToMentor = async (req, res) => {
  const { registeredEmail, student } = req.body;

  try {
    const mentor = await MentorProfileModel.findOne({ registeredEmail });

    if (!mentor) {
      return res.json({ success: false, message: "Mentor not found" });
    }

    // Check if student with the same registration number already exists
    const isDuplicate = mentor.student.some(
      existingStudent => existingStudent.registrationNumber === student.registrationNumber
    );

    if (isDuplicate) {
      return res.json({ 
        success: false, 
        message: "Student with this registration number already exists" 
      });
    }

    // Add student to the array
    mentor.student.push(student);
    await mentor.save();

    return res.json({ success: true, message: "Student added successfully!" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Failed to add student" });
  }
};

// Get all students assigned to a mentor
const getStudents = async (req, res) => {
  const { registeredEmail } = req.body;
  
  try {
    const mentor = await MentorProfileModel.findOne({ registeredEmail });
    
    if (!mentor) {
      return res.json({ 
        success: false, 
        message: "Mentor not found" 
      });
    }
    
    // Return the student array from the mentor's profile
    return res.json({ 
      success: true, 
      data: mentor.student || [] 
    });
    
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.json({
      success: false,
      message: "An unexpected error occurred while fetching students"
    });
  }
};

// Get report submission statistics for all students
const getReportStatistics = async (req, res) => {
  try {
    // Find all mentor profiles to aggregate student data
    const mentors = await MentorProfileModel.find({});
    
    // Initialize counters
    let totalStudents = 0;
    let weeklyReportsCount = 0;
    let monthlyReportsCount = 0;
    
    // Count total students, weekly reports, and monthly reports
    mentors.forEach(mentor => {
      // Add this mentor's students to total count
      totalStudents += mentor.student.length;
      
      // Count weekly reports
      weeklyReportsCount += mentor.weekly.length;
      
      // Count monthly reports
      monthlyReportsCount += mentor.monthly.length;
    });
    
    // Calculate not submitted counts
    const weeklyNotSubmitted = Math.max(0, totalStudents - weeklyReportsCount);
    const monthlyNotSubmitted = Math.max(0, totalStudents - monthlyReportsCount);
    
    // Format the response data for the frontend
    const reportStats = {
      weekly: [
        { name: 'Submitted', value: weeklyReportsCount },
        { name: 'Not Submitted', value: weeklyNotSubmitted }
      ],
      monthly: [
        { name: 'Submitted', value: monthlyReportsCount },
        { name: 'Not Submitted', value: monthlyNotSubmitted }
      ]
    };
    
    return res.json({
      success: true,
      data: reportStats
    });
    
  } catch (error) {
    console.error("Error fetching report statistics:", error);
    return res.json({
      success: false,
      message: "An unexpected error occurred while fetching report statistics"
    });
  }
};




export { 
  createProfile,
  getMentorProfile,
  saveMonthlyReportData,
  getMonthlyReports,
  deleteMonthlyReport,
  addStudentToMentor,
  getStudents,
  getReportStatistics,

};
