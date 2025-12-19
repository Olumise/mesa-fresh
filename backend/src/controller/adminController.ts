import { Request, Response, NextFunction } from "express";
import { addDBRole, getDBRoles, inviteUser } from "../services/admin.js";
import { generateRandomUUID } from "../lib/helper.js";

export const createDBRolesController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const dbRoles = await addDBRole();
		res.send(dbRoles);
	} catch (err) {
		next(err);
	}
};

export const getDBRolesController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const dbRoles = await getDBRoles();
		res.send(dbRoles);
	} catch (err) {
		next(err);
	}
};

export const inviteUserController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.body) {
			throw new Error("No data in request body!");
		}
		const invitationCode = generateRandomUUID().replaceAll("-", "");
		console.log(invitationCode);
		const { invited_by, invited_email, location_id } = req.body;
		const data = {
			invited_by,
			invited_email,
			invitation_code: invitationCode,
			location_id,
		};

		const invitation = await inviteUser(data);
		res.send(invitation);
	} catch (err) {
		next(err);
	}
};
