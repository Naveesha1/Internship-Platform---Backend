import internshipModel from "../../models/company/internshipModel.js";
import UserModel from "../../models/userModel.js";
import StudentProfileModel from "../../models/student/studentProfileModel.js";
import bcrypt from "bcrypt";
import companyProfileModel from "../../models/company/companyProfileModel.js";

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
  const { email } = req.body;
  try {
    const result = await UserModel.deleteOne({ email: email });
    if (result.deletedCount > 0) {
      return res.json({ success: true, message: "Successfully deleted!" });
    } else {
      return res.json({ success: false, message: "Failed to delete!" });
    }
  } catch (error) {
    return res.json({ success: false, message: "An error occured" });
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
};
