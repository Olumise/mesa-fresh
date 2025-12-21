import multer from "multer";
import path from "path";
import { AppError } from "./errorHandler.js";
const storage = multer.memoryStorage();
const limits = {
	fileSize: 5 * 1024 * 1024,
};

const ALLOWED_MIMES = ["image/jpeg", "image/jpg", "image/png", "image/wepb"];
export const uploadHandler = multer({
	storage: storage,
	limits: limits,
	fileFilter: (req, file, cb) => {
		if (!ALLOWED_MIMES.includes(file.mimetype)) {
			cb(new AppError(403, `${file.mimetype} not allowed!`));
			return;
		}
		cb(null, true);
	},
});
