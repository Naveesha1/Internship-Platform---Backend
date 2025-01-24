import express from 'express';
import { studentProfileController,getProfileController,getCVController,updateCvDetailsController } from '../controllers/student/studentController.js';
import { getAllInternshipController } from '../controllers/internshipController.js';

const studentRouter = express.Router();

studentRouter.post("/profile",studentProfileController);
studentRouter.post("/getprofile",getProfileController);
studentRouter.get("/allInternships",getAllInternshipController);
studentRouter.post("/getcv",getCVController);
studentRouter.put("/updateCvDetails",updateCvDetailsController)


export default studentRouter; 