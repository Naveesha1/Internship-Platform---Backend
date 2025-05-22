import express from "express";
import {
  getAdminProfileController,
  getAllAdminProfilesController,
  createNewAdminController,
  deleteAdminController,
  getAllInternshipsController,
  getAllStudentsController,
  updateIdStatusController,
  getAllCompaniesController,
  updateVerificationStatusController,
  getVerifiedCompaniesCountController,
  getVerifiedStudentsCountController,
  getPendingStudentsCountController,
  getPendingCompaniesCountController,
  getMonthlyRegistrationStatsController,
  getInternshipStatistics,
  getSelectionStatistics,
  getMonthlyInternshipsByDegree,
  getMonthlyReportsAvailableStudents,
  getWeeklyReportsAvailableStudents,
  getAllDocumentsController,
} from "../controllers/admin/adminController.js";
import { getSkillsDemandController } from "../controllers/internshipController.js";

const adminRouter = express.Router();

adminRouter.post("/getProfile", getAdminProfileController);
adminRouter.get("/getAllProfiles", getAllAdminProfilesController);
adminRouter.post("/addNewAdmin", createNewAdminController);
adminRouter.post("/deleteAdmin", deleteAdminController);
adminRouter.post("/getAllInternships", getAllInternshipsController);
adminRouter.get("/getAllStudents", getAllStudentsController);
adminRouter.put("/updateStudentStatus", updateIdStatusController);
adminRouter.get("/getAllCompanies", getAllCompaniesController);
adminRouter.put("/updateCompanyStatus", updateVerificationStatusController);

adminRouter.get("/getVerifiedCompanies", getVerifiedCompaniesCountController);
adminRouter.get("/getAllDocuments", getAllDocumentsController);
adminRouter.get("/getPendingCompanies", getPendingCompaniesCountController);
adminRouter.get("/getVerifiedStudents", getVerifiedStudentsCountController);
adminRouter.get("/getPendingStudents", getPendingStudentsCountController);
adminRouter.get("/monthlyRegistrationStatus", getMonthlyRegistrationStatsController);
adminRouter.get("/getSkillDemand",getSkillsDemandController);
adminRouter.get("/getInternshipStatistics",getInternshipStatistics);
adminRouter.get("/getSelectionStatistics",getSelectionStatistics);
adminRouter.get("/getMonthlyInternshipsByDegree",getMonthlyInternshipsByDegree);
adminRouter.get("/getMonthlyReportsAvailableStudents",getMonthlyReportsAvailableStudents);
adminRouter.get("/getWeeklyReportsAvailableStudents",getWeeklyReportsAvailableStudents);

export default adminRouter;