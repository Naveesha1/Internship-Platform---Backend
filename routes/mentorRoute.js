import express from "express";
import {
  createNewMentorController,
  deleteMentorController,
  getAllMentorProfilesController,
  deleteMonthlyReport,
  getMentorProfileController,
  getMonthlyReports,
  saveMonthlyReportData,
  addStudentToMentor,
  getReportStatistics,
  getStudents,
  getWeeklyReports,
  createMentorProfileController,
  getMentorCountByCompanyController,
  getCompanyMentorsController,
  getInternEmployeeCountController,
  getMentorDataDashboardCountsController,
  getWeeklyReportsCount,
} from "../controllers/mentor/mentorController.js";

const mentorRouter = express.Router();

mentorRouter.post("/createMentor", createNewMentorController);
mentorRouter.post("/createProfile", createMentorProfileController);
mentorRouter.post("/deleteMentor", deleteMentorController);
mentorRouter.post("/getProfile", getMentorProfileController);
mentorRouter.get("/getAllProfiles", getAllMentorProfilesController);
mentorRouter.post("/saveMonthlyReportData", saveMonthlyReportData);
mentorRouter.post("/getMonthlyReports", getMonthlyReports);
mentorRouter.post("/deleteMonthlyReport", deleteMonthlyReport);
mentorRouter.post("/saveStudentData", addStudentToMentor);
mentorRouter.post("/getAllStudent", getStudents);
mentorRouter.get("/getReportStaus", getReportStatistics);
mentorRouter.post("/getWeeklyReports", getWeeklyReports);

mentorRouter.post("/getMentorCountByCompanyController",getMentorCountByCompanyController)
mentorRouter.post("/getCompanyMentorsController",getCompanyMentorsController);
mentorRouter.post("/getInternEmployeeCountController",getInternEmployeeCountController)
mentorRouter.post("/countStudentWeeklyMonthly",getMentorDataDashboardCountsController);
mentorRouter.post("/getWeeklyReportsCount",getWeeklyReportsCount);

export default mentorRouter;
