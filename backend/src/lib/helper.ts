import { Location, Menu, LocationMenu } from "../../generated/prisma/client";
import { MenuWithCategory } from "../services/menu";

export function validateLocationInput(data: Location) {
	const { name, address, square_ft, sitting_capacity, open_date, is_active } =
		data;

	const locationEntries = Object.entries(data);

	for (const [key, value] of locationEntries) {
		if (!value || value === "") {
			throw new Error(`${key} is required`);
		}
	}
}

export function validateMenuInput(data: Menu) {
	const {
		name,
		price,
		description,
		image,
		category_id,
		calories,
		prep_time,
		is_customizable,
	} = data;
	const MenuEntries = Object.entries(data);

	for (const [key, value] of MenuEntries) {
		if (!value || value === "") {
			throw new Error(`${key} is required`);
		}
	}
}

export function validateMenuWithCategoryInput(data: MenuWithCategory) {
	const {
		name,
		price,
		description,
		image,
		category_name,
		category_description,
		calories,
		prep_time,
		is_customizable,
	} = data;
	const MenuEntries = Object.entries(data);

	for (const [key, value] of MenuEntries) {
		if (!value || value === "") {
			throw new Error(`${key} is required`);
		}
	}
}

export function validateLocationMenuInputs(data:LocationMenu){
	const { location_id, menu_id, is_available, quantity } = data;
	const LocationMenuEntries = Object.entries(data);

	for (const [key, value] of LocationMenuEntries) {
		if (!value || value === "") {
			throw new Error(`${key} is required`);
		}
	}
}
