import { fromNodeHeaders } from "better-auth/node";
import { Request, Response, NextFunction } from "express";
import { getUser } from "../services/profile.js";
import prisma from "../lib/prisma.js";

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
