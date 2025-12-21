import express from "express";
import { Request, Response, NextFunction } from "express";
import { uploadHandler } from "../middlewares/uploadHandler.js";
import { uploadMultipleFiles } from "../services/upload.js";

const uploadRouter = express();

uploadRouter.post(
	"/image-upload",
	uploadHandler.array("image", 2),
	async (req: Request, res: Response, next: NextFunction) => {
		if (!req.files || !Array.isArray(req.files)) {
			throw new Error("Upload Unsuccessful!");
		}
		const images = await uploadMultipleFiles(req.files);
		res.json({
			images,
			message: "Image uploaded successfully",
		});
	}
);

export default uploadRouter;
