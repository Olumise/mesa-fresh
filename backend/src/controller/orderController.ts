import { Request, Response, NextFunction } from "express";
import { createOrder, updateOrderStatus, cancelOrder, getLocationOrders, updatePaymentStatus } from "../services/order.js";
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

export const updateOrderStatusController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const orderId = req.params.orderId;
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

		if (!staff) {
			throw new AppError(401, "User not a Staff!");
		}

		if (!orderId) {
			throw new AppError(400, "Order ID is required!");
		}

		if (!locationId) {
			throw new AppError(400, "Location ID is required!");
		}

		const updatedOrder = await updateOrderStatus(
			orderId,
			req.body,
			staff.id,
			locationId
		);

		res.status(200).json({
			message: "Order status updated successfully!",
			data: updatedOrder,
		});
	} catch (err) {
		next(err);
	}
};

export const cancelOrderController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const orderId = req.params.orderId;
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

		if (!staff) {
			throw new AppError(401, "User not a Staff!");
		}

		if (!orderId) {
			throw new AppError(400, "Order ID is required!");
		}

		if (!locationId) {
			throw new AppError(400, "Location ID is required!");
		}

		const cancelledOrder = await cancelOrder(
			orderId,
			req.body,
			staff.id,
			locationId
		);

		res.status(200).json({
			message: "Order cancelled successfully!",
			data: cancelledOrder,
		});
	} catch (err) {
		next(err);
	}
};

export const getLocationOrdersController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const locationId = req.params.locationId;

		if (!locationId) {
			throw new AppError(400, "Location ID is required!");
		}

		const orders = await getLocationOrders(locationId);

		res.status(200).json({
			message: "Orders retrieved successfully!",
			data: orders,
		});
	} catch (err) {
		next(err);
	}
};

export const updatePaymentStatusController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const orderId = req.params.orderId;
		const locationId = req.params.locationId;

		if (!orderId) {
			throw new AppError(400, "Order ID is required!");
		}

		if (!locationId) {
			throw new AppError(400, "Location ID is required!");
		}

		const updatedPayment = await updatePaymentStatus(
			orderId,
			req.body,
			locationId
		);

		res.status(200).json({
			message: "Payment status updated successfully!",
			data: updatedPayment,
		});
	} catch (err) {
		next(err);
	}
};
