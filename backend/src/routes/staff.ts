import express from "express";
import {
	addManagerController,
	addStaffController,
	addStaffRolesController,
} from "../controller/staffController.js";
import { authVerify } from "../middlewares/authVerify.js";
import { dbRoleVerify } from "../middlewares/dbRoleVerify.js";

const staffRouter = express();

staffRouter.post("/add-staff", authVerify, addStaffController);
staffRouter.post(
	"/add-manager",
	authVerify,
	dbRoleVerify("Manager"),
	addManagerController
);

export default staffRouter;
