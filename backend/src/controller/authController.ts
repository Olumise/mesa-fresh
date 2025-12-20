import { Request, Response, NextFunction } from "express";
import { signInUser, signUpUser } from "../services/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { validatefullStaffSignupInput } from "../lib/validate.js";
import { addStaff } from "../services/staff.js";
import prisma from "../lib/prisma.js";
import { prismaError } from "prisma-better-errors";

export const signUpController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { headers, response } = await signUpUser(req.body);
		const cookies = headers.get("set-cookie");
		if (cookies) {
			res.setHeader("set-cookie", cookies);
		}

		res.status(201).json({
			message: "New User created successfully!",
			data: response,
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
		const { headers, response } = await signInUser(req.body);
		const cookies = headers.get("set-cookie");
		if (cookies) {
			res.setHeader("set-cookie", cookies);
		}

		res.status(201).json({
			message: "Signed In sucessfully!!",
			data: response,
		});
	} catch (err) {
		next(err);
	}
};

export const fullStaffSignupController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	validatefullStaffSignupInput(req.body);
	const {
		name,
		email,
		password,
		roleId,
		phone,
		location_id,
		date_joined,
		is_active,
		role_id,
		invitation_code,
	} = req.body;
	let createdUserId: string | null = null;
	try {
		const { headers, response } = await signUpUser(req.body);
		const cookies = headers.get("set-cookie");
		if (cookies) {
			res.setHeader("set-cookie", cookies);
		}
		const newUser = response.user;
		createdUserId = newUser.id;
		if (!newUser) {
			throw new Error("User not created!");
		}
		const staffInput: any = {
			location_id,
			user_id: newUser.id,
			date_joined,
			is_active,
			role_id,
			invitation_code,
		};
		const staff = await addStaff(staffInput);
		res.json({
			message: "Staff added successfully",
			data: staff,
		});
	} catch (err) {
		if (createdUserId) {
			try {
				await prisma.user.delete({
					where: {
						id: createdUserId,
					},
				});
			} catch (cleanUpError: any) {
				throw new prismaError(cleanUpError);
			}
		}
		next(err);
	}
};
