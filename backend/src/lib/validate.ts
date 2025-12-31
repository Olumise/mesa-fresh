import { APIError } from "better-auth/api";
import {
	Location,
	Menu,
	LocationMenu,
	Addon,
	MenuCategory,
	LocationIngredient,
	User,
	Staff,
	StaffInvitation,
	Manager,
} from "../../generated/prisma/client.js";
import { LocationSchemaCreate } from "../schemas/location.js";
import {
	CreateAddonSchema,
	CreateLocationIngredientSchema,
	CreateLocationMenuSchema,
	CreateMenuCategorySchema,
	MenuAndCategorySchemaCreate,
	MenuSchemaCreate,
} from "../schemas/menu.js";
import {
	CreateManagerSchema,
	CreateStaffInvitationSchema,
	CreateStaffSchema,
	fullStaffSignupSchema,
} from "../schemas/staff.js";
import { CreateUserSchema } from "../schemas/user.js";
import { UserAuthInput } from "../services/auth.js";
import { UpdatedMenu } from "../services/menu.js";
import { StaffExtendedInput } from "../services/staff.js";

import { capitalizeString } from "./helper.js";
import prisma from "./prisma.js";
import { object } from "zod";
import { CreateOrder, CreateOrderSchema, UpdatePaymentStatus, UpdatePaymentStatusSchema } from "../schemas/order.js";

export function validateLocationInput(data: Location) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	return LocationSchemaCreate.parse(data);
}

export function validateMenuInput(data: UpdatedMenu) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	return MenuSchemaCreate.parse(data);
}

export function validateLocationMenuInputs(data: LocationMenu) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	return CreateLocationMenuSchema.parse(data);
}

export function validateMenuCategoryInput(data: MenuCategory) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	return CreateMenuCategorySchema.parse(data);
}

export function validateNewAddonInputs(data: Addon) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	return CreateAddonSchema.parse(data);
}
export function validateLocationMenuIngredient(data: LocationIngredient) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	return CreateLocationIngredientSchema.parse(data);
}

export async function validateSignUpData(data: UserAuthInput) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	const role = await prisma.dBRole.findUnique({
		where: {
			id: data.roleId,
		},
	});
	if (!role) {
		throw new Error("Role is not valid");
	}
	return CreateUserSchema.parse(data);
}

export function validateSignInData(data: any) {
	const { email, password } = data;
	if (!email || !password) {
		throw new Error("Email and Password is required!");
	}
}

export function validateNewStaffData(data: StaffExtendedInput) {
	const {
		location_id,
		user_id,
		date_joined,
		is_active,
		role_id,
		invitation_code,
	} = data;
	if (!data) {
		throw new Error("No data in your request!");
	}
	return CreateStaffSchema.parse(data);
}

export function validateStaffInvitationCreation(data: StaffInvitation) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	return CreateStaffInvitationSchema.parse(data);
}

export async function validateBetterAuthSignUp(ctx: any) {
	if (!ctx.body) {
		throw new APIError("BAD_REQUEST", {
			message: "No data in your request!",
		});
	}
	const { name, email, password, roleId, phone } = ctx.body;
	if (!roleId) {
		throw new APIError("BAD_REQUEST", {
			message: "RoleId is required",
		});
	}
	if (!name) {
		throw new APIError("BAD_REQUEST", {
			message: "Name is required!",
		});
	}

	if (!email || !password) {
		throw new APIError("BAD_REQUEST", {
			message: "Email and Password is required!",
		});
	}

	const role = await prisma.dBRole.findUnique({
		where: {
			id: roleId,
		},
	});
	if (!role) {
		throw new APIError("BAD_REQUEST", {
			message: "Role is not valid",
		});
	}
}

export function validatefullStaffSignupInput(data: any) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	return fullStaffSignupSchema.parse(data);
}

export function validateManagerInput(data: Manager) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	return CreateManagerSchema.parse(data);
}

export function validateCreateOrderInput(data: CreateOrder) {
	if (!data) {
		throw new Error("No data in your request!");
	}

	return CreateOrderSchema.parse(data);
}

export function validateUpdatePaymentStatus(data: UpdatePaymentStatus) {
	if (!data) {
		throw new Error("No data in your request!");
	}

	return UpdatePaymentStatusSchema.parse(data);
}
