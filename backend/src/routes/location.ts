import express from "express";
const locationRouter = express();
import {
	addLocationController,
	getAllLocationsController,
	getUniqueLocationController,
} from "../controller/locationController.js";
import { getUniqueLocation } from "../services/location.js";

locationRouter.post("/add-new-location", addLocationController);
locationRouter.get("/all-locations", getAllLocationsController);
locationRouter.get("/:id", getUniqueLocationController);

export default locationRouter;
