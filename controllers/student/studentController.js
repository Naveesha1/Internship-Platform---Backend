import studentProfileModel from "../../models/student/studentProfileModel.js";
import mongoose from "mongoose";
import internshipModel from "../../models/company/internshipModel.js";

const studentProfileController = async (req, res) => {
  const {
    fullName,
    registrationNumber,
    degree,
    universityMail,
    contactNumber,
    gpa,
    profileImage,
    idFrontImage,
    idBackImage,
    skills,
    position,
    qualification,
    cv,
    verify,
    userEmail,
    certifications,
    cvName,
    cvPosition,
  } = req.body;

  try {
    const student = await studentProfileModel.findOne({ universityMail });
    if (student) {
      return res.json({ success: false, message: "Your details is exist" });
    } else {
      // Split the skills string into an array
      const skillsArray = skills
        ? skills.split(",").map((skill) => skill.trim())
        : [];
      const qualificationArray = qualification
        ? qualification.split(",").map((qualifi) => qualifi.trim())
        : [];
      const positionArray = position
        ? position.split(",").map((onePosition) => onePosition.trim())
        : [];
      const certificationArray = certifications
        ? certifications.split(",").map((certification) => certification.trim())
        : [];
      const validCvDetails = [
        {
          title: cvPosition,
          cvUrl: cv,
          fileName: cvName,
        },
      ];

      const newStudent = new studentProfileModel({
        fullName: fullName,
        registrationNumber: registrationNumber,
        degree: degree,
        universityMail: universityMail,
        contactNumber: contactNumber,
        gpa: gpa,
        profileImageUrl: profileImage,
        idFrontImageUrl: idFrontImage,
        idBackImageUrl: idBackImage,
        skills: skillsArray,
        position: positionArray,
        qualification: qualificationArray,
        verify: verify,
        registeredEmail: userEmail,
        certifications: certificationArray,
        cvData: validCvDetails,
      });
      await newStudent.save();
      return res.json({ success: true, message: "Saved successfully!" });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "An error occured while saving details",
    });
  }
};

const getProfileController = async (req, res) => {
  const { registeredEmail } = req.body;
  try {
    const studentProfile = await studentProfileModel.findOne({
      registeredEmail: registeredEmail,
    });
    if (!studentProfile) {
      return res.json({ success: false, message: "User not found" });
    } else {
      return res.json({ success: true, data: studentProfile });
    }
  } catch (error) {
    return res.json({ success: false, message: "An unexpected error occured" });
  }
};

const getCvDetailsController = async (req, res) => {
  const { registeredEmail } = req.body;

  try {
    const profile = await studentProfileModel.findOne({ registeredEmail });
    if (profile) {
      return res.json({ success: true, data: profile.cvData });
    } else {
      return res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    return res.json({ success: false, message: "An error occured during" });
  }
};

const addNewCvDetailsController = async (req, res) => {
  const { title, cvUrl, fileName, registeredEmail } = req.body;
  try {
    const profile = await studentProfileModel.findOne({ registeredEmail });
    if (profile) {
      const newCvData = {
        title: title,
        cvUrl: cvUrl,
        fileName: fileName,
      };
      profile.cvData.push(newCvData);
      await profile.save();
      return res.json({
        success: true,
        message: "CV details updated successfully!",
        data: profile.cvData,
      });
    } else {
      return res.json({ success: false, message: "Profile not found." });
    }
  } catch (error) {
    return res.json({ success: false, message: "An error occured" });
  }
};

const updateExistingCvDetails = async (req, res) => {
  const { title, fileName, cvUrl, registeredEmail, id } = req.body;
  try {
    const updatedProfile = await studentProfileModel.findOneAndUpdate(
      { registeredEmail, "cvData._id": id }, // Match the profile and specific CV by _id
      {
        $set: {
          "cvData.$.title": title,
          "cvData.$.cvUrl": cvUrl,
          "cvData.$.fileName": fileName,
        },
      },
      { new: true } // Return the updated document
    );
    return res.json({
      success: true,
      message: "CV updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    return res.json({ success: false, message: "An error occured" });
  }
};

const deleteExistingCvDetails = async (req, res) => {
  const { registeredEmail, id } = req.body;

  try {
    const cvDeletedProfile = await studentProfileModel.findOneAndUpdate(
      { registeredEmail: registeredEmail },
      { $pull: { cvData: { _id: id } } },
      { new: true }
    );
    if (!cvDeletedProfile) {
      return res.json({ success: false, message: "Profile not found" });
    }
    return res.json({
      success: true,
      message: "Successfully deleted",
      data: cvDeletedProfile,
    });
  } catch (error) {
    return res.json({ success: false, message: "An error occured" });
  }
};

const getSuggestInternships = async (req, res) => {
  const { registeredEmail } = req.body;
  try {
    const getProfile = await studentProfileModel.findOne({ registeredEmail });
    if (getProfile) {
      const positions = getProfile.position;
      const suggestInternships = await internshipModel.find({
        position: {
          $in: positions,
        },
      });

      return res.json({ success: true, data: suggestInternships });
    }
  } catch (error) {
    console.log(error);

    return { success: false, message: "Error occured" };
  }
};

const getStudentRegisteredId = async (req, res) => {
  try {
    const studentIds = await studentProfileModel.find(
      {},
      { registrationNumber: 1, _id: 0 }
    );
    const registeredIds = studentIds.map((id) => id.registrationNumber);
    return res.json({ success: true, data: registeredIds });
    console.log(registeredIds);
  } catch (error) {
    return res.json({ success: false, message: "An error occured" });
  }
};

const getStudentData = async (req, res) => {
  const { studentId } = req.body;
  try {
    const studentData = await studentProfileModel.findOne({
      registrationNumber: studentId,
    });
    if (studentData) {
      return res.json({ success: true, data: studentData.fullName });
    } else {
      return res.json({ success: false, message: "No user found" });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Internel server error",
      error: error,
    });
  }
};

export {
  studentProfileController,
  getProfileController,
  getCvDetailsController,
  addNewCvDetailsController,
  updateExistingCvDetails,
  deleteExistingCvDetails,
  getSuggestInternships,
  getStudentRegisteredId,
  getStudentData,
};
