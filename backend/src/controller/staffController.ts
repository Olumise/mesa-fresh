import { Request, Response, NextFunction } from "express";
import { addManager, addStaff, addStaffRoles } from "../services/staff.js";

export const addStaffRolesController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const staffRoles = await addStaffRoles();
		res.send(staffRoles);
	} catch (err: any) {
		next(err);
	}
};

export const addStaffController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const staff = await addStaff(req.body);
		res.json({
			message: "Staff added successfully",
			data: staff,
		});
	} catch (err) {
		next(err);
	}
};

export const addManagerController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const manager = await addManager(req.body);
		res.json({
			message: "Manager created successfully!",
			data: manager,
		});
	} catch (err) {
		next(err);
	}
};
