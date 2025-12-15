import { z } from "zod";

export const LocationSchema = z.object({
	name: z
		.string("Name should be a string")
		.min(1, "Location Name is required"),

	address: z
		.string("Address should be a string")
		.min(1, "Location Address is required"),

	square_ft: z
		.string("Square Ft should be a string")
		.min(1, "Location Square ft is required"),

	sitting_capacity: z
		.number("Sitting capacity should be a number")
		.int("Sitting capacity should be an integer")
		.nonnegative("Sitting capacity cannot be negative"),

	open_date: z
		.coerce
		.date("Open date should be a valid date"),

	is_active: z
		.boolean("Is active should be a boolean"),
});

export const LocationSchemaCreate = LocationSchema
export const LocationSchemaUpdate = LocationSchema.partial()