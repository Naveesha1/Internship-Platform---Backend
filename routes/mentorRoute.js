import express from "express";
import { addStudentToMentor, createProfile, deleteMonthlyReport, getMentorProfile, getMonthlyReports, getReportStatistics, getStudents, saveMonthlyReportData } from "../controllers/mentor/mentorController.js";

const mentorRouter = express.Router();

mentorRouter.post("/create", createProfile);
mentorRouter.post("/getProfile", getMentorProfile);
mentorRouter.post("/saveMonthlyReportData", saveMonthlyReportData);
mentorRouter.post("/getMonthlyReports",getMonthlyReports);
mentorRouter.delete("/deleteMonthlyReport",deleteMonthlyReport);
mentorRouter.post("/saveStudentData",addStudentToMentor);
mentorRouter.post("/getAllStudent",getStudents);
mentorRouter.get("/getReportStaus",getReportStatistics);

export default mentorRouter;
