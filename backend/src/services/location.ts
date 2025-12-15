import prisma from "../lib/prisma.js";
import { Location } from "../../generated/prisma/client.js";
import { validateLocationInput } from "../lib/validate.js";
import { prismaError } from "prisma-better-errors";
import { AppError } from "../middlewares/errorHandler.js";

export const addLocation = async (data: Location) => {
	validateLocationInput(data);

	const { name, address, square_ft, sitting_capacity, open_date, is_active } =
		data;
	try {
		const newLocation = await prisma.location.create({
			data: {
				name,
				address,
				square_ft,
				sitting_capacity,
				open_date,
				is_active,
			},
		});

		return newLocation;
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const getAllLocation = async () => {
	try {
		const allLocations = await prisma.location.findMany();
		return allLocations;
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const getUniqueLocation = async (id?: string) => {
	try {
		if (!id) {
			throw new Error("Id is required!");
		}
		const location = await prisma.location.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				address: true,
				square_ft: true,
				sitting_capacity: true,
				open_date: true,
				is_active: true,
			},
		});
		return location;
	} catch (err: any) {
		throw new prismaError(err);
	}
};
