import express from "express";
import {
  addEventController,
  getEventsController,
  updateEventsController,
} from "../controllers/calenderController.js";

const calenderRouter = express.Router();

calenderRouter.post("/addEvent", addEventController);
calenderRouter.post("/getEvents", getEventsController);
calenderRouter.put("/updateEvent", updateEventsController);

export default calenderRouter;
