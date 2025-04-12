import express from "express";
import { createProfile, deleteMonthlyReport, getMentorProfile, getMonthlyReports, saveMonthlyReportData } from "../controllers/mentor/mentorController.js";

const mentorRouter = express.Router();

mentorRouter.post("/create", createProfile);
mentorRouter.post("/getProfile", getMentorProfile);
mentorRouter.post("/saveMonthlyReportData", saveMonthlyReportData);
mentorRouter.post("/getMonthlyReports",getMonthlyReports);
mentorRouter.delete("/deleteMonthlyReport",deleteMonthlyReport);

export default mentorRouter;
