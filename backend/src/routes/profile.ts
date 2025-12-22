import express from "express";
import {
	editUserImageController,
	getUserController,
} from "../controller/profileController.js";
import { authVerify } from "../middlewares/authVerify.js";
import { uploadHandler } from "../middlewares/uploadHandler.js";

const profileRouter = express();

profileRouter.get("/me", authVerify, getUserController);
profileRouter.patch(
	"/edit-profile-image",
	authVerify,
	uploadHandler.single("image"),
	editUserImageController
);

export default profileRouter;
