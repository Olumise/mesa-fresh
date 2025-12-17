import {
	Location,
	Menu,
	LocationMenu,
	Addon,
	MenuCategory,
	LocationIngredient,
} from "../../generated/prisma/client";
import { LocationSchemaCreate } from "../schemas/location.js";
import {
	CreateAddonSchema,
	CreateLocationIngredientSchema,
	CreateLocationMenuSchema,
	CreateMenuCategorySchema,
	MenuAndCategorySchemaCreate,
	MenuSchemaCreate,
} from "../schemas/menu.js";
import { MenuWithCategory, UpdatedMenu } from "../services/menu";

import { capitalizeString } from "./helper.js";

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
