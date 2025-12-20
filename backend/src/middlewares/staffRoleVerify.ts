import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler.js";
import prisma from "../lib/prisma.js";

export const staffRoleVerify = (role: string | string[]) => {
	return async function (req: Request, res: Response, next: NextFunction) {
		const normalizedRoles = Array.isArray(role) ? role : [role];
		const userInfo = req?.user?.user;
		if (!userInfo) {
			throw new AppError(401, "Unauthorized!, please sign in");
		}
		if (userInfo.role === "Admin") {
			return next();
		}

		const staff = await prisma.staff.findFirst({
			where: {
				user_id: userInfo.id,
			},
		});
        if(!staff?.role_id){
            throw new AppError(401, "Unauthorized!, please sign in");
        }
		const staffRole = await prisma.staffRole.findUnique({
			where: {
				id: staff?.role_id,
			},
		});
        if(!staffRole?.name){
            throw new AppError(403, "Staff role not valid!");
        }
		if (!normalizedRoles.includes(staffRole?.name)) {
			throw new AppError(403, "Forbidden: You are not authorized!");
		}
		next();
	};
};
