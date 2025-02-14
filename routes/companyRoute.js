import express from "express";
import {
  companyProfileController,
  getCompanyController,
  getCompanySpecificInternshipController,
  getApplicantsController,
  updateCvStatusController,
} from "../controllers/company/companyController.js";
import { createInternshipController } from "../controllers/internshipController.js";

const companyRouter = express.Router();

companyRouter.post("/createprofile", companyProfileController);
companyRouter.post("/createIntern", createInternshipController);
companyRouter.post("/getCompany", getCompanyController);
companyRouter.post("/allInternships", getCompanySpecificInternshipController);
companyRouter.post("/getApplicants", getApplicantsController);
companyRouter.put("/updateStatus", updateCvStatusController);

export default companyRouter;
