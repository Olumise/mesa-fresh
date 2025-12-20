import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { getUser } from "../services/profile.js";
import prisma from "../lib/prisma.js";
import { AppError } from "./errorHandler.js";

export const authVerify = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const headers = fromNodeHeaders(req.headers);
		const user = await getUser(headers);
		if (!user?.user.id) {
			throw new AppError(401, "Unauthorized!, please sign in");
		}
		let role;
		if (user?.user.roleId) {
			role = await prisma.dBRole.findUnique({
				where: {
					id: user?.user.roleId,
				},
			});
		}
		req.user = {
			user: { ...user?.user, ...(role && { role: role?.name }) },
		};
		next();
	} catch (err) {
		next(err);
	}
};
