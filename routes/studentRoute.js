import express from 'express';
import { studentProfileController,getProfileController,getCVController } from '../controllers/student/studentController.js';
import { getAllInternshipController } from '../controllers/internshipController.js';

const studentRouter = express.Router();

studentRouter.post("/profile",studentProfileController);
studentRouter.post("/getprofile",getProfileController);
studentRouter.get("/allInternships",getAllInternshipController);
studentRouter.post("/getcv",getCVController);


export default studentRouter; 