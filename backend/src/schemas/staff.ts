import * as z from "zod";
import { CreateUserSchema } from "./user.js";

export const staffSchema = z.object({
	user_id: z
		.string("User ID should be a string!")
		.uuid("User Id should be a UUID"),

	location_id: z
		.string("Location ID should be a string!")
		.uuid("Location Id should be a UUID"),

	date_joined: z.coerce.date("Date Expected!"),

	is_active: z.boolean("Field is a Boolean!"),

	role_id: z
		.string("Role ID should be a string!")
		.uuid("Role Id should be a UUID"),

	invitation_code: z.string("Invitation Id should be a string!"),
});

export const StaffInvitationSchema = z.object({
	invited_by: z.string("Invited by should be a string"),

	invited_email: z
		.string("Invited email should be a string")
		.email("Invited email should be a valid email"),

	invitation_code: z
		.string("Invitation code should be a string")
		.min(1, "Invitation code is required"),

	location_id: z.string("Location Id should be a string"),

	is_accepted: z.boolean("Is accepted should be a boolean").optional(),

	accepted_at: z.coerce.date("Accepted at should be a valid date").optional(),
});

export const ManagerSchema = z.object({
	staff_id: z
		.string("Staff ID should be a string")
		.uuid("Staff ID should be a valid UUID"),

	location_id: z
		.string("Location ID should be a string")
		.uuid("Location ID should be a valid UUID"),
});
export const CreateStaffSchema = staffSchema;
export const UpdtaeStaffSchema = CreateStaffSchema.partial();
export const CreateStaffInvitationSchema = StaffInvitationSchema.omit({
	is_accepted: true,
	accepted_at: true,
});
export const AcceptStaffInvitationSchema = z.object({
	invitation_code: z
		.string("Invitation code should be a string")
		.min(1, "Invitation code is required"),
});

export const fullStaffSignupSchema = CreateStaffSchema.merge(
	CreateUserSchema
).omit({
	user_id: true,
});
export const CreateManagerSchema = ManagerSchema;
