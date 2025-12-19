import express from "express";
import {
	fullStaffSignupController,
	signInController,
	signUpController,
} from "../controller/authController.js";
const authRouter = express();

authRouter.post("/signup", signUpController);
authRouter.post("/signin", signInController);
authRouter.post("/signup-staff", fullStaffSignupController);

export default authRouter;
