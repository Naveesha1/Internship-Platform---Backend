import express from 'express'
import { companyProfileController,getCompanyController } from '../controllers/company/companyController.js';
import { createInternshipController } from '../controllers/internshipController.js';

const companyRouter = express.Router();

companyRouter.post("/createprofile",companyProfileController);
companyRouter.post("/createIntern",createInternshipController);
companyRouter.post("/getCompany",getCompanyController);
 

export default companyRouter;