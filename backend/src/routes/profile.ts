import express from "express";
import { getUserController } from "../controller/profileController.js";

const profileRouter = express();

profileRouter.get("/me", getUserController)

export default profileRouter