import express from "express";
import {
  studentProfileController,
  getProfileController,
  getCvDetailsController,
  addNewCvDetailsController,
  updateExistingCvDetails,
  deleteExistingCvDetails,
  getSuggestInternships,
  getStudentRegisteredId,
  getStudentData,
  getGpaDistribution,
  getRegistrationId,
  saveWeeklyReportData,
  getWeeklyReports,
  deleteWeeklyReport,
  getStudentProfileById,
  updateProfileController,
  saveMonthlyReportData,
  getMonthlyReports,
  deleteMonthlyReport,
  updateWeeklyReport,
} from "../controllers/student/studentController.js";
import {
  applyInternshipController,
  getAllInternshipController,
  getMatchingInternshipsController,
  getResponseCompaniesController,
  getSeparateResponseCountsController,
  getSubmittedApplicationsController,
  remainInternshipController,
} from "../controllers/internshipController.js";

const studentRouter = express.Router();

studentRouter.post("/profile", studentProfileController);
studentRouter.post("/getprofile", getProfileController);
studentRouter.get("/allInternships", getAllInternshipController);
studentRouter.post("/getMatchingInternshipsController",getMatchingInternshipsController);
studentRouter.post("/getCvDetails", getCvDetailsController);
studentRouter.put("/addNewCvDetails", addNewCvDetailsController);
studentRouter.put("/updateNewCv", updateExistingCvDetails);
studentRouter.put("/deleteCv", deleteExistingCvDetails);
studentRouter.post("/getSuggestions", getSuggestInternships);
studentRouter.post("/applications", applyInternshipController);
studentRouter.post("/getSubmitted", getSubmittedApplicationsController);
studentRouter.post("/newChances", remainInternshipController);

studentRouter.get("/getStudentRegisteredId", getStudentRegisteredId);
studentRouter.post("/getStudentName", getStudentData);
studentRouter.get("/gpa-distribution", getGpaDistribution);
studentRouter.post("/getRegistrationId", getRegistrationId);
studentRouter.post("/saveWeeklyReport", saveWeeklyReportData);
studentRouter.post("/getWeeklyReports", getWeeklyReports);
studentRouter.delete("/deleteWeeklyReport", deleteWeeklyReport);
studentRouter.post("/getStudentProfileById",getStudentProfileById);
studentRouter.post("/getResponseCompaniesController",getResponseCompaniesController);
studentRouter.post("/respinseCompaniesRejectOrAccept",getSeparateResponseCountsController);
studentRouter.put("/updateStudentProfile",updateProfileController);
studentRouter.post("/saveMonthlyReportStudent",saveMonthlyReportData);
studentRouter.post("/getMonthlyReports",getMonthlyReports);
studentRouter.delete("/deleteMonthlyReport",deleteMonthlyReport);
studentRouter.post("/updateWeeklyReport",updateWeeklyReport);


export default studentRouter;
