import prisma from "../lib/prisma";
import {
	Menu,
	MenuCategory,
	LocationMenu,
	Addon,
	MenuAddon,
} from "../../generated/prisma/client";
import {
	validateMenuInput,
	validateMenuWithCategoryInput,
	validateLocationMenuInputs,
	validateNewAddonInputs,
} from "../lib/validate";

export interface MenuWithAddons extends Menu {
	addons?: { addon_id: string }[];
}
export interface MenuWithCategory extends Omit<MenuWithAddons, "category_id"> {
	category_name: string;
	category_description?: string;
}

const addMenuCategory = async (data: MenuCategory) => {
	const { name, description } = data;
	if (!name) {
		throw new Error("Category Name is required!");
	}
	const newCategory = await prisma.menuCategory.create({
		data,
	});
	return newCategory;
};

const addNewMenu = async (data: MenuWithAddons) => {
	validateMenuInput(data);
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
	});
	return newMenu;
};

const addNewMenuWithCategory = async (data: MenuWithCategory) => {
	const {
		name,
		price,
		description,
		image,
		calories,
		prep_time,
		category_name,
		category_description,
		is_customizable,
		addons,
	} = data;

	validateMenuWithCategoryInput(data);
	let queryData: any = {
		name,
		price,
		description,
		image,
		calories,
		prep_time,
		is_customizable,
		category: {
			create: {
				name: category_name,
				description: category_description || null,
			},
		},
	};
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
	});

	return newMenu;
};

const getAllMenu = async () => {
	const allMenu = await prisma.menu.findMany();
	return allMenu;
};

const addNewAddon = async (data: Addon) => {
	const { name, price, is_free } = data;
	validateNewAddonInputs(data);
	const newAddon = await prisma.addon.create({
		data,
	});
	return newAddon;
};

const addLocationMenu = async (data: LocationMenu) => {
	const { location_id, menu_id, is_available, quantity } = data;
	validateLocationMenuInputs(data);
	const newLocationMenu = await prisma.locationMenu.create({
		data,
	});
	return newLocationMenu;
};

const getLocationMenu = async (locationId: string) => {
	if (!locationId) {
		throw new Error("Location Id is required!");
	}
	const locationMenu = await prisma.locationMenu.findUnique({
		where: {
			id: locationId,
		},
	});
	return locationMenu;
};
