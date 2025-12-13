import prisma from "../lib/prisma";
import { Location } from "../../generated/prisma/client";
import { validateLocationInput } from "../lib/validate";

const addLocation = async (data: Location) => {
	const { name, address, square_ft, sitting_capacity, open_date, is_active } =
		data;
	validateLocationInput(data);

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
};

const getAllLocation = async () => {
	const allLocations = await prisma.location.findMany();
	return allLocations;
};

const getUniqueLocation = async (locationName?: string, id?: string) => {
	if (!locationName && !id) {
		throw new Error("Id or Name is required");
	}
	if (locationName) {
		const location = await prisma.location.findUnique({
			where: { name: locationName },
		});
		return location;
	}
	if (id) {
		const location = await prisma.location.findUnique({
			where: { id: id },
		});
		return location;
	}
};
