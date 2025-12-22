import { fromNodeHeaders } from "better-auth/node";
import { Request, Response, NextFunction } from "express";
import { editUserImage, getUser } from "../services/profile.js";
import prisma from "../lib/prisma.js";
import { AppError } from "../middlewares/errorHandler.js";

export const getUserController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const headers = fromNodeHeaders(req.headers);
		const user = await getUser(headers);
		let role;
		if (user?.user.roleId) {
			role = await prisma.dBRole.findUnique({
				where: {
					id: user?.user.roleId,
				},
			});
		}
		res.json({
			user: {
				...user?.user,
				...(role && { role: role?.name }),
			},
			...(process.env.MODE === "development" && { token: user?.session }),
		});
	} catch (err) {
		next(err);
	}
};

export const editUserImageController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.file) {
			throw new Error("No Image uploaded!");
		}
		if (!req.user?.user.id) {
			throw new AppError(401, "Unauthenticated!, Please sign in.");
		}
		const user = await editUserImage(req.file, req.user?.user.id);
		res.json({
			message: 'User updated successfully!',
			data: user
		})
	} catch (err: any) {
		next(err);
	}
};
