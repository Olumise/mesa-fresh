import express from "express";
const locationRouter = express();
import {
	addLocationController,
	getAllLocationsController,
	getUniqueLocationController,
} from "../controller/locationController.js";
import { getUniqueLocation } from "../services/location.js";
import { authVerify } from "../middlewares/authVerify.js";
import { locationVerify } from "../middlewares/locationVerify.js";

import { dbRoleVerify } from "../middlewares/dbRoleVerify.js";

locationRouter.post("/add-new-location",authVerify,dbRoleVerify("Admin"), addLocationController);
locationRouter.get("/all-locations",authVerify,dbRoleVerify("Admin"), getAllLocationsController);
locationRouter.get("/:locationId",authVerify,locationVerify, getUniqueLocationController);

export default locationRouter;
