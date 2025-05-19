import MentorProfileModel from "../../models/mentor/mentorProfileModel.js";
import StudentProfileModel from "../../models/student/studentProfileModel.js";
import UserModel from "../../models/userModel.js";
import CompanyModel from "../../models/company/companyProfileModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import companyProfileModel from "../../models/company/companyProfileModel.js";

const createNewMentorController = async (req, res) => {
  const { name, position, email, password, registeredEmail } = req.body;
  
  try {
    // Check if mentor email already exists
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res.json({ success: false, message: "Mentor already exists!" });
    }
    
    // Find the company by email
    const company = await CompanyModel.findOne({ registeredEmail: registeredEmail });
    if (!company) {
      return res.json({ success: false, message: "Company not found!" });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create a new mentor user
    const newMentor = new UserModel({
      name: name,
      position: position,
      email: email,
      password: hashedPassword,
      role: "Mentor",
    });
    await newMentor.save();
    
    // Add mentor to company's mentors array
    company.mentors.push({
      mentorName: name,
      mentorPosition: position,
      mentorEmail: email,
    });
    
    await company.save();
    
    return res.json({
      success: true,
      message: "Mentor created successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: "An error occurred!" });
  }
};


const createMentorProfileController = async (req, res) => {
  const { mentorName, address, registeredEmail, company,position,contactNumber } = req.body;
  try {
      const newProfile = new MentorProfileModel({
        name: mentorName,
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

const getPositionAndCompany = async (req, res) => {
  const { registeredEmail } = req.body;

  try {
    // 1. Find mentor profile to get position
    const profile = await UserModel.findOne({ email: registeredEmail });
    if (!profile) {
      return res.json({ success: false, message: "Mentor profile not found." });
    }

    const mentorPosition = profile.position;

    // 2. Find company where this mentor email exists in the mentors array
    const company = await companyProfileModel.findOne({
      mentors: {
        $elemMatch: { mentorEmail: registeredEmail },
      },
    });

    if (!company) {
      return res.json({ success: false, message: "Company not found for this mentor." });
    }

    const companyName = company.companyName;
console.log(mentorPosition,companyName);
    // 3. Return the combined object
    return res.json({
      success: true,
      data: {
        position: mentorPosition,
        companyName: companyName,
      },
    });
  } catch (error) {
    console.error("Error in getPositionAndCompany:", error);
    return res.json({ success: false, message: "An error occurred!", error });
  }
};


const getMentorProfileController = async (req, res) => {
  const { registeredEmail } = req.body;
  try {
    const getProfile = await MentorProfileModel.findOne({ registeredEmail: registeredEmail });
    if (getProfile) {
      return res.json({ success: true, data: getProfile });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    return res.json({ success: false, error:error });
  }
};

// Delete Mentor Controller
const deleteMentorController = async (req, res) => {
  const { email, registeredEmail } = req.body;
  
  try {
    // Delete from UserModel
    const deletedMentor = await UserModel.findOneAndDelete({ email: email });
    
    if (!deletedMentor) {
      return res.json({ success: false, message: "Mentor not found!" });
    }
    
    // Find company and remove mentor from its mentors array
    const company = await CompanyModel.findOne({ registeredEmail: registeredEmail });
    
    if (company) {
      // Filter out the mentor to be deleted
      company.mentors = company.mentors.filter(
        mentor => mentor.mentorEmail !== email
      );
      
      await company.save();
    }
    
    return res.json({
      success: true,
      message: "Mentor deleted successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: "An error occurred!" });
  }
};

// Remove Student from Mentor 
const removeStudentFromMentorController = async (req, res) => {
  const { email, registeredEmail } = req.body; // email = student email to remove

  try {
    const mentor = await MentorProfileModel.findOne({ registeredEmail });

    if (!mentor) {
      return res.json({ success: false, message: "Mentor does not completed their profile!" });
    }

    // Filter out the student whose email matches
    const originalLength = mentor.student.length;
    mentor.student = mentor.student.filter(student => student.email !== email);

    // Save only if a student was removed
    if (mentor.student.length === originalLength) {
      return res.json({ success: false, message: "Student not found in mentor profile!" });
    }

    await mentor.save();

    return res.json({
      success: true,
      message: "Student removed successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "An error occurred!" });
  }
};


// Get Company Mentors Controller
const getCompanyMentorsController = async (req, res) => {
  const { registeredEmail } = req.body;
  
  try {
    const company = await CompanyModel.findOne({ registeredEmail: registeredEmail });
    
    if (!company) {
      return res.json({ success: false, message: "Company not found!" });
    }
    
    return res.json({
      success: true,
      mentors: company.mentors || []
    });
  } catch (error) {
    return res.json({ success: false, message: "An error occurred!" });
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

// mentorController
const getWeeklyReports = async (req, res) => {
  const { registeredEmail } = req.body;
  try {
    const mentor = await MentorProfileModel.findOne({ registeredEmail: registeredEmail });
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
          reportUrl: weeklyEntry.reportUrl,
          status: weeklyEntry.status || 'View' // Add status field with default 'View'
        });
      });
    });
    
    return res.json({success: true, data: studentsWithWeekly});
  } catch (error) {
    return res.json({success: false, message: "An unexpected error occurred!"})
  }
}


const getMentorCountByCompanyController = async (req, res) => {
  try {
    const { registeredEmail } = req.body;

    const company = await CompanyModel.findOne({ registeredEmail });

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const mentorCount = company.mentors.length;

    return res.json({ success: true, count: mentorCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getInternEmployeeCountController = async (req, res) => {
  try {
    const { registeredEmail } = req.body;

    const company = await CompanyModel.findOne({ registeredEmail });

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const mentorEmails = company.mentors.map(mentor => mentor.mentorEmail);

    let totalStudentCount = 0;

    for (const email of mentorEmails) {
      const mentor = await MentorModel.findOne({ mentorEmail: email });
      if (mentor && Array.isArray(mentor.students)) {
        totalStudentCount += mentor.students.length;
      }
    }

    return res.json({ success: true, count: totalStudentCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMentorDataDashboardCountsController = async (req, res) => {
  const { registeredEmail } = req.body;

  try {
    const mentor = await MentorProfileModel.findOne({ registeredEmail });

    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor not found" });
    }

    const monthlyCount = mentor.monthly?.length || 0;
    const studentCount = mentor.student?.length || 0;

    return res.json({
      success: true,
      data: {
        monthlyCount,
        studentCount,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const getWeeklyReportsCount = async (req, res) => {
  const { registeredEmail } = req.body;
  try {
    // Find the mentor profile using the email
    const mentor = await MentorProfileModel.findOne({ registeredEmail: registeredEmail });
    
    if (!mentor) {
      return res.json({ success: false, message: "Mentor not found" });
    }
    
    // Extract registration numbers of all students under this mentor
    const registrationNumbers = mentor.student.map(student => student.registrationNumber);

    // Find all student profiles that match these registration numbers
    const studentProfiles = await StudentProfileModel.find({
      registrationNumber: { $in: registrationNumbers }
    });

    // Count the total number of weekly reports
    let totalWeeklyReports = 0;
    
    studentProfiles.forEach(profile => {
      // Add the length of the weekly array for each student
      totalWeeklyReports += profile.weekly.length;
    });
    
    // Return only the count as you requested
    return res.json({ 
      success: true, 
      count: totalWeeklyReports  // Changed to 'count' instead of 'data' object
    });
    
  } catch (error) {
    console.error("Error in getWeeklyReportsCount:", error);
    return res.json({ success: false, message: "An unexpected error occurred!" });
  }
};



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
  getMentorCountByCompanyController,
  getCompanyMentorsController,
  getInternEmployeeCountController,
  getMentorDataDashboardCountsController,
  getWeeklyReportsCount,
  removeStudentFromMentorController,
  getPositionAndCompany,
};
