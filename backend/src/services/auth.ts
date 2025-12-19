import { User } from "@/generated/prisma/client.js";
import { validateSignInData, validateSignUpData } from "../lib/validate.js";
import { auth } from "../lib/auth.js";
import { AppError } from "../middlewares/errorHandler.js";
import { fromNodeHeaders } from "better-auth/node";
import prisma from "../lib/prisma.js";

export interface UserAuthInput extends User {
	password: string;
}

export const signUpUser = async (data: UserAuthInput) => {
	await validateSignUpData(data);
	const { name, email, phone, password, roleId } = data;

	try {
		const data = await auth.api.signUpEmail({
			returnHeaders: true,
			body: {
				name,
				email,
				password,
				roleId,
				phone,
			},
		});
		return data;
	} catch (err: any) {
		throw new Error(err);
	}
};

export const signInUser = async (data: any) => {
	validateSignInData(data);
	const { email, password } = data;
	try {
		const data = await auth.api.signInEmail({
			returnHeaders: true,
			body: {
				email,
				password,
			},
			
		});
		return data
	} catch (err: any) {
		throw new Error(err);
	}
};
