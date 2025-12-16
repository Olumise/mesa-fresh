import { Request, Response, NextFunction } from "express";
import {
	addLocation,
	getAllLocation,
	getUniqueLocation,
} from "../services/location.js";
import { AppError } from "../middlewares/errorHandler.js";
import { string } from "zod";

export const addLocationController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const newLocation = await addLocation(req.body);
		res.json({
			message: "Location created successfully!",
			data: newLocation,
		});
	} catch (err: any) {
		next(err);
	}
};

export const getAllLocationsController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const allLocation = await getAllLocation();
		res.json({
			no_of_locations: allLocation.length,
			data: allLocation,
		});
	} catch (err) {
		next(err);
	}
};

export const getUniqueLocationController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const location = await getUniqueLocation(id);
		res.send(location);
	} catch (err) {
		next(err);
	}
};
