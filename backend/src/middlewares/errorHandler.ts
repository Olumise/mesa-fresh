import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
	statusCode: number;
	isOperational: boolean;
	cause?: unknown;

	constructor(statusCode: number, cause: unknown, message: string) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;
		this.cause = cause;

		Error.captureStackTrace(this, new.target);
	}
}

export const ErrorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			message: err.message,
			cause: err.cause,
		});
	}
	console.log("Error:", err.message);
	return res.status(500).json({
		message: err.message,
	});
};
