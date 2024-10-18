import express from "express"
import { loginUser,registerUser,resetPasswordController,forgotpasswordController } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/forgetPassword",forgotpasswordController)
userRouter.post("/resetPassword",resetPasswordController)

export default userRouter;