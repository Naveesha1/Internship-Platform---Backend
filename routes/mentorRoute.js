import express from "express";
import { createProfile, getMentorProfile } from "../controllers/mentor/mentorController.js";

const mentorRouter = express.Router();

mentorRouter.post("/create", createProfile);
mentorRouter.post("/getProfile", getMentorProfile);

export default mentorRouter;
