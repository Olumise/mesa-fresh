import { Request, Response, NextFunction } from "express";
import { addDBRole, getDBRoles } from "../services/admin.js";

export const createDBRolesController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const dbRoles = await addDBRole();
        res.send(dbRoles)
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
        res.send(dbRoles)
	} catch (err) {
		next(err);
	}
};


