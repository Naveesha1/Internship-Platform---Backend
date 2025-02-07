import express from 'express'
import { companyProfileController,getCompanyController, getCompanySpecificInternshipController } from '../controllers/company/companyController.js';
import { createInternshipController } from '../controllers/internshipController.js';

const companyRouter = express.Router();

companyRouter.post("/createprofile",companyProfileController);
companyRouter.post("/createIntern",createInternshipController);
companyRouter.post("/getCompany",getCompanyController);
companyRouter.post("/allInternships",getCompanySpecificInternshipController);
 

export default companyRouter;