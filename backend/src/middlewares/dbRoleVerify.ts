import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler.js";

export const dbRoleVerify = (role: string | string[]) => {
	return function (req: Request, res: Response, next: NextFunction) {
		const normalizedRoles = Array.isArray(role) ? role : [role];
		const userInfo = req?.user?.user;
		if (!userInfo || !userInfo.role) {
			throw new AppError(401, "Unauthorized!, please sign in");
		}

		if (!normalizedRoles.includes(userInfo.role)) {
			throw new AppError(403, "Forbidden: You are not authorized!");
		}
		next();
	};
};
