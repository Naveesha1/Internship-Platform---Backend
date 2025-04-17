import express from "express";
import {
  createNewMentorController,
  deleteMentorController,
  getAllMentorProfilesController,
  deleteMonthlyReport,
  getMentorProfileController,
  getMonthlyReports,
  saveMonthlyReportData,
} from "../controllers/mentor/mentorController.js";

const mentorRouter = express.Router();

mentorRouter.post("/createMentor", createNewMentorController);
mentorRouter.post("/deleteMentor", deleteMentorController);
mentorRouter.post("/getProfile", getMentorProfileController);
mentorRouter.get("/getAllProfiles", getAllMentorProfilesController);
mentorRouter.post("/saveMonthlyReportData", saveMonthlyReportData);
mentorRouter.post("/getMonthlyReports", getMonthlyReports);
mentorRouter.delete("/deleteMonthlyReport", deleteMonthlyReport);

export default mentorRouter;
