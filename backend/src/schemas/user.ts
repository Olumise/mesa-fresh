import { z } from "zod";

export const UserSchema = z.object({
	name: z.string("Name should be a string").min(1, "User name is required"),

	email: z
		.string("Email should be a string")
		.email("Email should be a valid email address"),

	image: z.string("Image should be a string").optional(),

	phone: z
		.string("Phone should be a string")
		.min(1, "Phone number is required"),

	roleId: z
		.string("Role ID should be a string")
		.uuid("Role ID should be a valid UUID"),

	password: z
		.string("Password must be a string!")
		.min(8, "Password must be greater than 8 characters!"),
});


export const CreateUserSchema = UserSchema;
export const UpdateUserSchema = CreateUserSchema.partial();
