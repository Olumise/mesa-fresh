import { Request, Response, NextFunction } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import { prismaError } from "prisma-better-errors";
import z from "zod";

export class AppError extends Error {
	statusCode: number;
	isOperational: boolean;

	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;

		Error.captureStackTrace(this, new.target);
	}
}

export const ErrorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof prismaError) {
		console.log("Error:", err);
		return res.status(err.statusCode).json({
			title: err.title,
			message: err.message,
			metaData: err.metaData,
			...(process.env.MODE === "development" && { issues: err.stack })
		});
	}
	if (err instanceof z.ZodError) {
		console.log(err.issues)
		return res.status(500).json({
			title: err.name,
			message: err.issues[0]?.message,
			...(process.env.MODE === "development" && { issues: err.issues })
		});
	}
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			message: err.message,
			url: req.url,
			type: "AppError",
			...(process.env.MODE === "development" && { stack: err.stack }),
		});
	}

	console.log("Error:", err.message);
	return res.status(500).json({
		message: err.message,
		url: req.url,
		cause:err.cause,
		...(process.env.MODE === "development" && { stack: err.stack })
	});
};
