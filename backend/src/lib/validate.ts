import {
	Location,
	Menu,
	LocationMenu,
	Addon,
	MenuCategory,
	LocationIngredient,
	User,
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
import { CreateUserSchema } from "../schemas/user.js";
import { UserAuthInput } from "../services/auth.js";
import { MenuWithCategory, UpdatedMenu } from "../services/menu.js";

import { capitalizeString } from "./helper.js";
import prisma from "./prisma.js";

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

export function validateMenuWithCategoryInput(data: MenuWithCategory) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	return MenuAndCategorySchemaCreate.parse(data);
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

export function validateSignInData(data:any){
	const {email,password}= data
	if(!email || !password){
		throw new Error("Email and Password is required!")
	}
	
}
