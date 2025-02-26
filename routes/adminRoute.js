import express from "express";
import {
  getAdminProfileController,
  getAllAdminProfilesController,
  createNewAdminController,
  deleteAdminController,
  getAllInternshipsController,
  getAllStudentsController,
  updateIdStatusController,
} from "../controllers/admin/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/getProfile", getAdminProfileController);
adminRouter.get("/getAllProfiles", getAllAdminProfilesController);
adminRouter.post("/addNewAdmin", createNewAdminController);
adminRouter.post("/deleteAdmin", deleteAdminController);
adminRouter.post("/getAllInternships", getAllInternshipsController);
adminRouter.get("/getAllStudents", getAllStudentsController);
adminRouter.put("/updateStatus", updateIdStatusController);

export default adminRouter;
