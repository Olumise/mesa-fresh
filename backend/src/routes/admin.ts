import express from "express";
import { createDBRolesController, getDBRolesController } from "../controller/adminController.js";
const adminRouter = express();

adminRouter.post("/create-db-roles", createDBRolesController);
adminRouter.get("/get-db-roles", getDBRolesController);



export default adminRouter