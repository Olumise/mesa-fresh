import express from "express";
import { getUserController } from "../controller/profileController.js";
import { authVerify } from "../middlewares/authVerify.js";

const profileRouter = express();

profileRouter.get("/me", authVerify, getUserController);

export default profileRouter;
