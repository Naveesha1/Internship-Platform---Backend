import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import createToken from "../config/createToken.js";
import { sendForgotPasswordEmail } from "../config/sendEmails.js";
import notificationModel from "../models/notificationModel.js";
import studentProfileModel from "../models/student/studentProfileModel.js";
import companyProfileModel from "../models/company/companyProfileModel.js";

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await userModel.findOne({ email });
    if (!userData) {
      return res.json({ success: false, message: "User does not exists" });
    }
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    // const token = createToken(userData);
    const token = createToken({
      email: userData.email,
      name: userData.name,
      role: userData.role,
      _id: userData._id,
    });

    res.json({ success: true, token, userData });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

//register user
const registerUser = async (req, res) => {
  const { name, password, role, email, veryfied } = req.body;
  try {
    //checking is user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    //validating email format & password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // set admin notification
    const admin = "Admin";
    const newNotification = new notificationModel({
      role: admin,
      message: `New ${role} has registered`,
    });
    await newNotification.save();

    const newUser = new userModel({
      name: name,
      email: email,
      role: role,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.json({ success: true, message: "Registration success!" });
  } catch (error) {
    res.json({ success: false, message: "error" });
  }
};

// forgot password controller
const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.json({ success: false, message: "Please" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }

    const exists = await userModel.findOne({ email });
    if (!exists) {
      return res.json({ success: false, message: "User not found" });
    } else {
      const token = createToken({ email: exists.email });
      const link = `http://localhost:3000/resetPassword?token=${token}`;
      // return res.json({success:true,link,message:"Reset verification email has sent"});
      const sendMail = await sendForgotPasswordEmail(exists.email, link);

      if (sendMail) {
        return res.json({
          success: false,
          message: "Error in sending password reset email",
        });
      } else {
        return res.json({
          success: true,
          message: "Reset password email has sent to your email",
        });
      }
    }
  } catch (error) {
    res.json({ success: false, message: "error occurred" });
  }
};

// reset password controller
const resetPasswordController = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  try {
    if (!password || !confirmPassword || !email) {
      return res.json({
        success: false,
        message: "Please fill in all the fields",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }

    const exists = await userModel.findOne({ email });

    if (!exists) {
      return res.json({ success: false, message: "User not found" });
    }

    // if (
    //   newPassword.length < 8 &&
    //   ![A - Z].test(newPassword) &&
    //   ![a - z].test(newPassword) &&
    //   ![0 - 9].test(newPassword) &&
    //   !/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(newPassword)
    // ) {
    //   return res.json({
    //     success: false,
    //     msg: "Please enter a valid password with at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
    //   });
    // }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedData = await userModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } }
    );

    if (updatedData) {
      return res.json({
        success: true,
        message: "Password updated successfully",
      });
    } else {
      return res.json({ success: false, message: "Something went wrong" });
    }
  } catch (error) {
    res.json({ success: false, message: "An error has occurred" });
  }
};

const getProfileImage = async(req,res) => {
  const {decodedEmail} = req.body;
  try {
    const user = await userModel.findOne({email:decodedEmail});
    if(user.role === "Student"){
      const student = await studentProfileModel.findOne({registeredEmail:decodedEmail})
      if(student) {
        return res.json({success:true, url:student.profileImageUrl});
      }
    } else if(user.role === "Company" ){
      const company = await companyProfileModel.findOne({registeredEmail:decodedEmail})
      if(company){
        return res.json({success:true, url:company.companyLogo});
      }
    }
    else {
      return res.json({success:false});
    }
  } catch (error) {
    return res.json({success:false, message:"An error occurred",error})
  }
}

export {
  loginUser,
  registerUser,
  forgotPasswordController,
  resetPasswordController,
  getProfileImage,
};
