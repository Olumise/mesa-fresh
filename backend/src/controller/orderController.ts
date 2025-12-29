import { Request, Response, NextFunction } from "express";
import { createOrder } from "../services/order.js";
import { AppError } from "../middlewares/errorHandler.js";
import prisma from "../lib/prisma.js";

export const createOrderController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const locationId = req.params.locationId;
		const userId = req.user?.user.id;
		if (!userId) {
			throw new AppError(401, "User not authenticated!");
		}

		const staff = await prisma.staff.findFirst({
			where: {
				user_id: userId,
			},
		});
		if(!staff){
			throw new AppError(401, "User not a Staff!");
		}

		const createdById = staff?.id;

		if (!locationId) {
			throw new AppError(400, "Location ID is required!");
		}

		

		const order = await createOrder(req.body, locationId, createdById);

		res.status(201).json({
			message: "Order created successfully!",
			data: order,
		});
	} catch (err) {
		next(err);
	}
};
