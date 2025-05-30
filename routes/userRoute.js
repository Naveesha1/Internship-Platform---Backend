import express from "express";
import {
  loginUser,
  registerUser,
  resetPasswordController,
  forgotPasswordController,
  getProfileImage,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgetPassword", forgotPasswordController);
userRouter.post("/resetPassword", resetPasswordController);
userRouter.post("/getProfileImage", getProfileImage);

export default userRouter;
