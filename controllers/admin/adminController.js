import internshipModel from "../../models/company/internshipModel.js";
import UserModel from "../../models/userModel.js";
import StudentProfileModel from "../../models/student/studentProfileModel.js";
import bcrypt from "bcrypt";

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

export {
  getAdminProfileController,
  getAllAdminProfilesController,
  createNewAdminController,
  deleteAdminController,
  getAllInternshipsController,
  getAllStudentsController,
  updateIdStatusController,
};
