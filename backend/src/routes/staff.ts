import express from "express";
import { addStaffController, addStaffRolesController } from "../controller/staffController.js";

const staffRouter = express()

staffRouter.post("/add-staff-roles", addStaffRolesController)
staffRouter.post("/add-staff", addStaffController)


export default staffRouter