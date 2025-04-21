import MentorProfileModel from "../../models/mentor/mentorProfileModel.js";
import StudentProfileModel from "../../models/student/studentProfileModel.js";
import UserModel from "../../models/userModel.js";
import bcrypt from "bcrypt";

const createNewMentorController = async (req, res) => {
  const { name, position, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const mentor = await UserModel.findOne({ email: email });
    if (mentor) {
      return res.json({ success: false, message: "Mentor already exists!" });
    } else {
      const newMentor = new UserModel({
        name: name,
        position: position,
        email: email,
        password: hashedPassword,
        role: "Mentor",
      });
      await newMentor.save();
      return res.json({
        success: true,
        message: "Mentor created successfully!",
      });
    }
  } catch (error) {
    return res.json({ success: false, message: "An error occurred!" });
  }
};

const createMentorProfileController = async (req, res) => {
  const { name, address, registeredEmail, company,position,contactNumber } = req.body;

  try {
      const newProfile = new MentorProfileModel({
        name: name,
        position: position,
        address: address,
        registeredEmail: registeredEmail,
        company: company,
        contactNumber: contactNumber,
        monthly: [],
        weekly: [],
        student: [],
      });
      await newProfile.save();
      return res.json({
        success: true,
        message: "Profile created successfully!",
      });
    
  } catch (error) {
    return res.json({ success: false, message: "An error occurred!" });
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
    return res.json({ success: false, message: "An error occurred" });
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
    const studentProfile = await StudentProfileModel.findOne({
      registrationNumber: index});
    if(studentProfile) {
      const newMonthlyData = {
        month: month,
        name: name,
        index: index,
        reportUrl: reportUrl,
      };
    }
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
      // Return the monthly reports as they are stored in the database
      // The frontend will handle grouping them by student
      return res.json({ success: true, data: profile.monthly });
    } else {
      return res.json({ success: false, message: "Mentor profile not found" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const deleteMonthlyReport = async (req, res) => {
  const { userEmail, reportId } = req.body; // Use reportId here as passed from the frontend
  try {
    // Convert reportId to ObjectId
    const Profile = await MentorProfileModel.findOneAndUpdate(
      { registeredEmail: userEmail },
      { $pull: { monthly: { _id: reportId } } },
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
      (existingStudent) =>
        existingStudent.registrationNumber === student.registrationNumber
    );

    if (isDuplicate) {
      return res.json({
        success: false,
        message: "Student with this registration number already exists",
      });
    }

    // Add student to the array
    mentor.student.push(student);
    await mentor.save();

    return res.json({ success: true, message: "Student added successfully!" });
  } catch (error) {
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
        message: "Mentor not found",
      });
    }

    // Return the student array from the mentor's profile
    return res.json({
      success: true,
      data: mentor.student || [],
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.json({
      success: false,
      message: "An unexpected error occurred while fetching students",
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
    mentors.forEach((mentor) => {
      // Add this mentor's students to total count
      totalStudents += mentor.student.length;

      // Count weekly reports
      weeklyReportsCount += mentor.weekly.length;

      // Count monthly reports
      monthlyReportsCount += mentor.monthly.length;
    });

    // Calculate not submitted counts
    const weeklyNotSubmitted = Math.max(0, totalStudents - weeklyReportsCount);
    const monthlyNotSubmitted = Math.max(
      0,
      totalStudents - monthlyReportsCount
    );

    // Format the response data for the frontend
    const reportStats = {
      weekly: [
        { name: "Submitted", value: weeklyReportsCount },
        { name: "Not Submitted", value: weeklyNotSubmitted },
      ],
      monthly: [
        { name: "Submitted", value: monthlyReportsCount },
        { name: "Not Submitted", value: monthlyNotSubmitted },
      ],
    };

    return res.json({
      success: true,
      data: reportStats,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "An unexpected error occurred while fetching report statistics",
    });
  }
};

const getWeeklyReports = async (req, res) => {
  const { registeredEmail } = req.body;
  try {
    const mentor = await MentorProfileModel.findOne({ registeredEmail:registeredEmail });
    const registrationNumbers = mentor.student.map(student => student.registrationNumber);

    const studentProfiles = await StudentProfileModel.find({
      registrationNumber: { $in: registrationNumbers }
    });

    const studentsWithWeekly = [];

    let idCounter = 1;

    studentProfiles.forEach(profile => {
      profile.weekly.forEach(weeklyEntry => {
        studentsWithWeekly.push({
          id: idCounter++,
          fullName: profile.fullName,
          registrationNumber: profile.registrationNumber,
          weekNo: weeklyEntry.weekNo,
          reportUrl: weeklyEntry.reportUrl
        });
      });
    });

    
    return res.json({success:true, data:studentsWithWeekly});
  } catch (error) {
    return res.json({success:false, message:"An unexpected error occured!"})
  }
}

export {
  createNewMentorController,
  getMentorProfileController,
  getAllMentorProfilesController,
  deleteMentorController,
  saveMonthlyReportData,
  getMonthlyReports,
  deleteMonthlyReport,
  addStudentToMentor,
  getStudents,
  getReportStatistics,
  getWeeklyReports,
  createMentorProfileController,
};
