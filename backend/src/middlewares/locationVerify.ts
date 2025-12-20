import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler.js";
import prisma from "../lib/prisma.js";

export const locationVerify = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { locationId } = req.params;
		if (!locationId) {
			throw new AppError(500, "Location Id required");
		}
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
				location_id: locationId,
			},
		});
		
		if (!staff) {
			throw new AppError(401, "You are not authorized to view this location!");
		}

		next();
	} catch (err) {
		next(err);
	}
};
