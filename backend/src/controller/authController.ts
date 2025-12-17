import { Request, Response, NextFunction } from "express";
import { signInUser, signUpUser } from "../services/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const signUpController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const newUser = await signUpUser(req.body);
		res.status(201).json({
			message: "New User created successfully!",
			data: newUser,
		});
	} catch (err) {
		next(err);
	}
};

export const signInController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const headers = fromNodeHeaders(req.headers);
		const user = await signInUser(req.body, headers);
		res.status(201).send(user);
	} catch (err) {
		next(err);
	}
};

