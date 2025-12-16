import prisma from "../lib/prisma.js";
import {
	Menu,
	MenuCategory,
	LocationMenu,
	Addon,
	MenuAddon,
} from "../../generated/prisma/client.js";
import {
	validateMenuInput,
	validateLocationMenuInputs,
	validateNewAddonInputs,
	validateMenuCategoryInput,
} from "../lib/validate.js";
import { prismaError } from "prisma-better-errors";

export interface MenuWithAddons extends Menu {
	addons?: { addon_id: string }[];
}
export interface MenuWithCategory extends Omit<MenuWithAddons, "category_id"> {
	category_name: string;
	category_description?: string;
}
export interface UpdatedMenu extends Omit<MenuWithAddons, "category_id"> {
	category_name?: string;
	category_description?: string;
	category_id?: string;
	addons?: { addon_id: string }[];
}

export const addMenuCategory = async (data: MenuCategory) => {
	validateMenuCategoryInput(data);
	try {
		const { name, description } = data;

		const newCategory = await prisma.menuCategory.create({
			data,
		});
		return newCategory;
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const addNewMenu = async (data: UpdatedMenu) => {
	validateMenuInput(data);
	try {
		const {
			name,
			price,
			description,
			image,
			category_id,
			calories,
			prep_time,
			is_customizable,
			addons,
			category_name,
			category_description,
		} = data;
		let queryData: any = {
			name,
			price,
			description,
			image,
			category_id,
			calories,
			prep_time,
			is_customizable,
		};
		if (!category_id && !category_name) {
			throw new Error("Category Id or Category Name is required!");
		}
		if (category_name) {
			queryData = {
				name,
				price,
				description,
				image,
				category: {
					create: {
						name: category_name,
						description: category_description || null,
					},
				},
				calories,
				prep_time,
				is_customizable,
			};
		}
		if (addons && addons.length > 0) {
			queryData = {
				...queryData,
				menu_addons: {
					create: addons,
				},
			};
		}
		const newMenu = await prisma.menu.create({
			data: queryData,
			include: {
				category: true,
				menu_addons: true,
			},
		});
		return newMenu;
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const getAllMenu = async () => {
	const allMenu = await prisma.menu.findMany();
	return allMenu;
};

export const addNewAddon = async (data: Addon) => {
	const { name, price, is_free } = data;
	try {
		validateNewAddonInputs(data);
		const newAddon = await prisma.addon.create({
			data,
		});
		return newAddon;
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const addLocationMenu = async (data: LocationMenu) => {
	const { location_id, menu_id, is_available, quantity } = data;
	validateLocationMenuInputs(data);
	try {
		const newLocationMenu = await prisma.locationMenu.create({
			data,
			include: {
				location: true,
				menu: true,
			},
		});
		return newLocationMenu;
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const getLocationMenu = async (locationId?: string) => {
	if (!locationId) {
		throw new Error("Location Id is required!");
	}
	try {
		const locationMenu = await prisma.locationMenu.findMany({
			where: {
				location_id: locationId,
			},
			include: {
				location: true,
				menu: true,
			},
		});
		return locationMenu;
	} catch (err: any) {
		throw new prismaError(err);
	}
};
