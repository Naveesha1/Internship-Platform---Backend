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
} from "../controllers/admin/adminController.js";

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

export default adminRouter;
