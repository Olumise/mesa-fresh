import express from "express";
import { createDBRolesController, getDBRolesController, inviteUserController } from "../controller/adminController.js";
const adminRouter = express();

adminRouter.post("/create-db-roles", createDBRolesController);
adminRouter.get("/get-db-roles", getDBRolesController);
adminRouter.post("/invite-user", inviteUserController)



export default adminRouter