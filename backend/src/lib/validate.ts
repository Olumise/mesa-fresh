import {
	Location,
	Menu,
	LocationMenu,
	Addon,
	MenuCategory,
} from "../../generated/prisma/client";
import { LocationSchemaCreate } from "../schemas/location.js";
import { CreateAddonSchema, CreateMenuCategorySchema, MenuAndCategorySchemaCreate, MenuSchemaCreate } from "../schemas/menu.js";
import { MenuWithCategory } from "../services/menu";

import { capitalizeString } from "./helper.js";

export function validateLocationInput(data: Location) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	return LocationSchemaCreate.parse(data)

}

export function validateMenuInput(data: Menu) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	return MenuSchemaCreate.parse(data)
}

export function validateMenuWithCategoryInput(data: MenuWithCategory) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	return MenuAndCategorySchemaCreate.parse(data)
}

export function validateLocationMenuInputs(data: LocationMenu) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	const { location_id, menu_id, is_available, quantity } = data;

	if (!location_id) throw new Error("Location_id is required");
	if (!menu_id) throw new Error("Menu_id is required");
	if (is_available === undefined || is_available === null)
		throw new Error("Is_available is required");
	if (!quantity) throw new Error("Quantity is required");
}

export function validateMenuCategoryInput(data:MenuCategory){
	if (!data) {
		throw new Error("No data in your request!");
	}
	return CreateMenuCategorySchema.parse(data)
}

export function validateNewAddonInputs(data: Addon) {
	if (!data) {
		throw new Error("No data in your request!");
	}
	return CreateAddonSchema.parse(data)
}
