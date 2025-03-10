import express from 'express';
import { 
    studentProfileController,
    getProfileController,
    getCvDetailsController,
    addNewCvDetailsController,
    updateExistingCvDetails,
    deleteExistingCvDetails,
    getSuggestInternships } from '../controllers/student/studentController.js';
import { 
    applyInternshipController,
    getAllInternshipController,
    getSubmittedApplicationsController,
    remainInternshipController } from '../controllers/internshipController.js';

const studentRouter = express.Router();

studentRouter.post("/profile",studentProfileController);
studentRouter.post("/getprofile",getProfileController);
studentRouter.get("/allInternships",getAllInternshipController);
studentRouter.post("/getCvDetails",getCvDetailsController);
studentRouter.put("/addNewCvDetails",addNewCvDetailsController);
studentRouter.put("/updateNewCv",updateExistingCvDetails);
studentRouter.put("/deleteCv",deleteExistingCvDetails)
studentRouter.post("/getSuggestions",getSuggestInternships);
studentRouter.post("/applications",applyInternshipController);
studentRouter.post("/getSubmitted",getSubmittedApplicationsController);
studentRouter.post("/newChances",remainInternshipController);


export default studentRouter; 