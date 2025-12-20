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
	"/create-db-roles",
	authVerify,
	dbRoleVerify("Admin"),
	createDBRolesController
);
adminRouter.get(
	"/get-db-roles",
	authVerify,
	dbRoleVerify("Admin"),
	getDBRolesController
);
adminRouter.post(
	"/invite-user",
	authVerify,
	dbRoleVerify("Admin"),
	inviteUserController
);

export default adminRouter;
