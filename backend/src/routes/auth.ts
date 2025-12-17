import express from "express";
import {
	signInController,
	signUpController,
} from "../controller/authController.js";
const authRouter = express();

authRouter.post("/sign-up/email", signUpController);
authRouter.post("/sign-in/email", signInController);
authRouter.post("/me", signInController);


export default authRouter;
