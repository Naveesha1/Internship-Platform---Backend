import internshipModel from "../../models/company/internshipModel.js";
import UserModel from "../../models/userModel.js";
import StudentProfileModel from "../../models/student/studentProfileModel.js";
import bcrypt from "bcrypt";
import companyProfileModel from "../../models/company/companyProfileModel.js";
import mentorProfileModel from "../../models/mentor/mentorProfileModel.js";


const getAdminProfileController = async (req, res) => {
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

const getAllAdminProfilesController = async (req, res) => {
  try {
    const profiles = await UserModel.find({ role: "Admin" });
    if (profiles) {
      return res.json({ success: true, data: profiles });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    return res.json({ success: false });
  }
};

const createNewAdminController = async (req, res) => {
  const { name, position, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAdmin = new UserModel({
      name: name,
      position: position,
      email: email,
      password: hashedPassword,
      role: "Admin",
    });
    await newAdmin.save();
    return res.json({ success: true, message: "Admin created successfully!" });
  } catch (error) {
    console.log(error);

    return res.json({ success: false, message: "An error occured!" });
  }
};

const deleteAdminController = async (req, res) => {
  const { email,registeredEmail } = req.body;
  try {
    if(email === registeredEmail) {
      return res.json({ success: false, message: "You cannot delete yourself!" });
    }
    else{
    const result = await UserModel.deleteOne({ email: email });
    if (result.deletedCount > 0) {
      return res.json({ success: true, message: "Successfully deleted!" });
    } else {
      return res.json({ success: false, message: "Failed to delete!" });
    }
    }
  } catch (error) {
    return res.json({ success: false, message: "An error occurred" });
  }
};

const getAllInternshipsController = async (req, res) => {
  try {
    const internships = await internshipModel.find();
    if (internships) {
      return res.json({ success: true, data: internships.reverse() });
    } else {
      return res.json({
        success: false,
        message: "Fetching internships detail failed",
      });
    }
  } catch (error) {
    return res.json({ success: false, message: "Getting internships failed" });
  }
};

const getAllStudentsController = async (req, res) => {
  try {
    const students = await StudentProfileModel.find();
    if (students) {
      return res.json({ success: true, data: students });
    } else {
      return res.json({ success: false, message: "Error getting students!" });
    }
  } catch (error) {
    return res.json({ success: false, message: "Server error" });
  }
};

const getAllCompaniesController = async (req, res) => {
  try {
    const companies = await companyProfileModel.find();
    if (companies) {
      return res.json({ success: true, data: companies });
    } else {
      return res.json({ success: false, message: "Error getting companies!" });
    }
  } catch (error) {
    return res.json({ success: false, message: "Server error" });
  }
};

const updateIdStatusController = async (req, res) => {
  const { id, status } = req.body;

  try {
    const application = await StudentProfileModel.findById(id);

    if (!application) {
      return res.json({ success: false, message: "Application not found" });
    }

    application.verify = status;
    await application.save();

    return res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    return res.json({ success: false, message: "Failed to update status" });
  }
};

const updateVerificationStatusController = async (req, res) => {
  const { id, status } = req.body;

  try {
    const company = await companyProfileModel.findById(id);

    if (!company) {
      return res.json({ success: false, message: "Application not found" });
    }
    company.verify = status;
    await company.save();

    return res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    return res.json({ success: false, message: "Failed to update status" });
  }
};

const getVerifiedCompaniesCountController = async (req, res) => {
  try {
    const count = await companyProfileModel.countDocuments({
      verify: true,
    });
    if (count) {
      return res.json({ success: true, count: count });
    } else {
      returnres.json({ success: false });
    }
  } catch (error) {
    return res.json({ success: false });
  }
};

const getPendingCompaniesCountController = async (req, res) => {
  try {
    const count = await companyProfileModel.countDocuments({
      verify: null,
    });
    if (count) {
      return res.json({ success: true, count: count });
    } else {
      returnres.json({ success: false });
    }
  } catch (error) {
    return res.json({ success: false });
  }
};

const getVerifiedStudentsCountController = async (req, res) => {
  try {
    const count = await StudentProfileModel.countDocuments({
      verify: true,
    });
    if (count) {
      return res.json({ success: true, count: count });
    } else {
      returnres.json({ success: false });
    }
  } catch (error) {
    return res.json({ success: false });
  }
};

const getPendingStudentsCountController = async (req, res) => {
  try {
    const count = await StudentProfileModel.countDocuments({
      verify: null,
    });
    if (count) {
      return res.json({ success: true, count: count });
    } else {
      returnres.json({ success: false });
    }
  } catch (error) {
    return res.json({ success: false });
  }
};

const getMonthlyRegistrationStatsController = async (req, res) => {
  try {
    const today = new Date();
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(today.getMonth() - 3); // Go back 3 months to cover the last 4 months including the current month

    // Aggregation to get student registration counts
    const studentData = await StudentProfileModel.aggregate([
      {
        $match: {
          date: { $gte: fourMonthsAgo.toISOString().split("T")[0] },
        },
      },
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] }, // Extract YYYY-MM from date
          studentCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    // Aggregation to get company registration counts
    const companyData = await companyProfileModel.aggregate([
      {
        $match: {
          date: { $gte: fourMonthsAgo.toISOString().split("T")[0] },
        },
      },
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] }, // Extract YYYY-MM from date
          companyCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    // Merge student and company data
    const response = {};
    studentData.forEach((entry) => {
      response[entry._id] = { studentCount: entry.studentCount, companyCount: 0 };
    });
    companyData.forEach((entry) => {
      if (response[entry._id]) {
        response[entry._id].companyCount = entry.companyCount;
      } else {
        response[entry._id] = { studentCount: 0, companyCount: entry.companyCount };
      }
    });

    return res.json({ success: true, data: response });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error fetching monthly stats" });
  }
};


const getInternshipStatistics = async (req, res) => {
  try {
    // Get all verified students
    const allVerifiedStudents = await StudentProfileModel.find({ verify: true });
    
    // Filter students by degree
    const itStudents = allVerifiedStudents.filter(student => student.degree === "IT");
    const itmStudents = allVerifiedStudents.filter(student => student.degree === "ITM");
    const aiStudents = allVerifiedStudents.filter(student => student.degree === "AI");
    
    // Get all mentors with students
    const allMentors = await mentorProfileModel.find({});
    
    // Extract all registration numbers of students with internships
    const studentsWithInternships = new Set();
    allMentors.forEach(mentor => {
      mentor.student.forEach(student => {
        studentsWithInternships.add(student.registrationNumber);
      });
    });
    
    // Count students with internships by degree
    let itWithInternship = 0;
    let itmWithInternship = 0;
    let aiWithInternship = 0;
    
    // Count internships for IT students
    itStudents.forEach(student => {
      if (studentsWithInternships.has(student.registrationNumber)) {
        itWithInternship++;
      }
    });
    
    // Count internships for ITM students
    itmStudents.forEach(student => {
      if (studentsWithInternships.has(student.registrationNumber)) {
        itmWithInternship++;
      }
    });
    
    // Count internships for AI students
    aiStudents.forEach(student => {
      if (studentsWithInternships.has(student.registrationNumber)) {
        aiWithInternship++;
      }
    });
    
    // Calculate totals
    const totalItStudents = itStudents.length;
    const totalItmStudents = itmStudents.length;
    const totalAiStudents = aiStudents.length;
    const totalAllStudents = allVerifiedStudents.length;
    const totalWithInternship = itWithInternship + itmWithInternship + aiWithInternship;
    
    // Prepare chart data in the format expected by the frontend
    const itInternshipData = [
      { name: "Got Internship", value: itWithInternship },
      { name: "No Internship", value: totalItStudents - itWithInternship }
    ];
    
    const itmInternshipData = [
      { name: "Got Internship", value: itmWithInternship },
      { name: "No Internship", value: totalItmStudents - itmWithInternship }
    ];
    
    const aiInternshipData = [
      { name: "Got Internship", value: aiWithInternship },
      { name: "No Internship", value: totalAiStudents - aiWithInternship }
    ];
    
    const allInternshipData = [
      { name: "Got Internship", value: totalWithInternship },
      { name: "No Internship", value: totalAllStudents - totalWithInternship }
    ];
    
    // Return the prepared data
    return res.status(200).json({
      success: true,
      data: {
        itInternship: itInternshipData,
        itmInternship: itmInternshipData,
        aiInternship: aiInternshipData,
        allInternship: allInternshipData,
      },
      message: "Internship statistics fetched successfully"
    });
    
  } catch (error) {
    console.error("Error fetching internship statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch internship statistics",
      error: error.message
    });
  }
};


const getSelectionStatistics = async (req, res) => {
  try {
    // Find all mentor profiles that have students
    const mentorProfiles = await mentorProfileModel.find({
      student: { $exists: true, $not: { $size: 0 } }
    });

    // Object to track company counts
    const companyCounts = {};
    // Object to track position counts
    const positionCounts = {};

    // Process each mentor profile
    mentorProfiles.forEach(mentor => {
      // Count the company
      if (mentor.company) {
        companyCounts[mentor.company] = (companyCounts[mentor.company] || 0) + mentor.student.length;
      }
      
      // Count positions for each student
      mentor.student.forEach(student => {
        if (student.position) {
          positionCounts[student.position] = (positionCounts[student.position] || 0) + 1;
        }
      });
    });

    // Convert company counts to array and sort by count descending
    const topCompanies = Object.entries(companyCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Get top 10

    // Convert position counts to array and sort by count descending
    const allPositions = Object.entries(positionCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Send the results
    res.status(200).json({
      success: true,
      data: {
        topCompanies,
        allPositions
      }
    });
    
  } catch (error) {
    console.error("Error fetching selection statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch selection statistics",
      error: error.message
    });
  }
};


const getMonthlyInternshipsByDegree = async (req, res) => {
  try {
    // Get current date
    const currentDate = new Date();
    
    // Calculate start date (4 months ago)
    const startDate = new Date();
    startDate.setMonth(currentDate.getMonth() - 3); // -3 to include current month (total 4 months)
    
    // Get all mentor profiles that have students
    const mentorProfiles = await mentorProfileModel.find({
      "student.0": { $exists: true }  // Find only mentors who have at least one student
    }, {
      "student": 1  // Project only the student field
    });

    // Initialize monthly data structure
    const monthlyData = {};
    
    // Get month names for the last 4 months
    const months = [];
    for (let i = 0; i < 4; i++) {
      const monthDate = new Date(currentDate);
      monthDate.setMonth(currentDate.getMonth() - i);
      const monthName = monthDate.toLocaleString('default', { month: 'short' });
      const year = monthDate.getFullYear();
      const monthKey = `${monthName} ${year}`;
      months.unshift(monthKey);
      
      // Initialize monthly data
      monthlyData[monthKey] = {
        month: monthKey,
        IT: 0,
        ITM: 0,
        AI: 0
      };
    }

    // Process all students from mentor profiles
    for (const mentor of mentorProfiles) {
      for (const student of mentor.student) {
        // Skip if no start date
        if (!student.startDate) continue;
        
        // Parse start date
        const startDate = new Date(student.startDate);
        
        // Only include students from the last 4 months
        if (startDate < new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1)) {
          continue;
        }

        // Get month key
        const monthName = startDate.toLocaleString('default', { month: 'short' });
        const year = startDate.getFullYear();
        const monthKey = `${monthName} ${year}`;
        
        // Skip if month is not in our range
        if (!monthlyData[monthKey]) continue;
        
        // Get student details to determine degree
        const studentDetails = await StudentProfileModel.findOne({ registrationNumber: student.registrationNumber });
        
        if (studentDetails && studentDetails.degree) {
          // Increment count based on degree
          if (studentDetails.degree === 'IT' && monthlyData[monthKey]) {
            monthlyData[monthKey].IT++;
          } else if (studentDetails.degree === 'ITM' && monthlyData[monthKey]) {
            monthlyData[monthKey].ITM++;
          } else if (studentDetails.degree === 'AI' && monthlyData[monthKey]) {
            monthlyData[monthKey].AI++;
          }
        }
      }
    }

    // Convert object to array for charting
    const result = months.map(month => monthlyData[month]);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error fetching monthly internship statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch monthly internship statistics",
      error: error.message
    });
  }
};

export {
  getAdminProfileController,
  getAllAdminProfilesController,
  createNewAdminController,
  deleteAdminController,
  getAllInternshipsController,
  getAllStudentsController,
  updateIdStatusController,
  getAllCompaniesController,
  updateVerificationStatusController,
  getVerifiedCompaniesCountController,
  getVerifiedStudentsCountController,
  getPendingStudentsCountController,
  getPendingCompaniesCountController,
  getMonthlyRegistrationStatsController,
  getInternshipStatistics,
  getSelectionStatistics,
  getMonthlyInternshipsByDegree,
};
