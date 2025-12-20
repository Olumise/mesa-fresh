import express from "express";
import {
	addManagerController,
	addStaffController,
	addStaffRolesController,
} from "../controller/staffController.js";

const staffRouter = express();

staffRouter.post("/add-staff-roles", addStaffRolesController);
staffRouter.post("/add-staff", addStaffController);
staffRouter.post("/add-manager", addManagerController);

export default staffRouter;
