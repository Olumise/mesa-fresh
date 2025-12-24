import express from "express";
import {
	createDBRolesController,
	getDBRolesController,
	inviteUserController,
} from "../controller/adminController.js";
import { authVerify } from "../middlewares/authVerify.js";
import { dbRoleVerify } from "../middlewares/dbRoleVerify.js";
const adminRouter = express();

adminRouter.post(
	"/invite-user",
	authVerify,
	dbRoleVerify("Admin"),
	inviteUserController
);

export default adminRouter;
