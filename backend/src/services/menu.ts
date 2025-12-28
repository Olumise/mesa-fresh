import prisma from "../lib/prisma.js";
import {
	Menu,
	MenuCategory,
	LocationMenu,
	Addon,
	MenuAddon,
	Ingredient,
	LocationIngredient,
	Prisma,
} from "../../generated/prisma/client.js";
import {
	validateMenuInput,
	validateLocationMenuInputs,
	validateNewAddonInputs,
	validateMenuCategoryInput,
} from "../lib/validate.js";
import { prismaError } from "prisma-better-errors";
import menuRouter from "../routes/menu.js";

export interface UpdatedMenu extends Omit<Menu, "category_id"> {
	category_name?: string;
	category_description?: string;
	category_id?: string;
	addons?: { addon_id: string }[];
	ingredients: {
		ingredient_id: string;
		quantity: number;
		unit: string;
	}[];
}
export interface UpdatedAddon extends Addon {
	ingredients: {
		ingredient_id: string;
		quantity: number;
		unit: string;
	}[];
}


export const addIngredients = async (data: Ingredient[]) => {
	if (!Array.isArray(data) || data.length === 0) {
		throw new Error("Ingredients data required!");
	}
	for (const { name } of data) {
		if (!name) {
			throw new Error("Name is required!");
		}
	}
	try {
		const newIngredients = await prisma.ingredient.createManyAndReturn({
			data,
		});
		return newIngredients;
	} catch (err: any) {
		throw new prismaError(err);
	}
};

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
			ingredients,
		} = data;
		let queryData: any = {
			name,
			price,
			description,
			image,
			calories,
			prep_time,
			is_customizable,
			menu_ingredients: {
				create: ingredients,
			},
		};

		if (category_name) {
			queryData.category = {
				create: {
					name: category_name,
					description: category_description || null,
				},
			};
		} else if (category_id) {
			const category = await prisma.menuCategory.findUnique({
				where: {
					id: category_id,
				},
			});
			if (!category) {
				throw new Error(`Category with id of ${category_id} not found!`);
			}
			queryData.category_id = category_id;
		} else {
			throw new Error("Category Id or Category Name is required!");
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
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			throw new prismaError(err);
		}
		throw new Error(err);
	}
};

export const getAllMenu = async () => {
	const allMenu = await prisma.menu.findMany();
	return allMenu;
};

export const addNewAddon = async (data: UpdatedAddon) => {
	validateNewAddonInputs(data);
	const { name, price, is_free, ingredients } = data;
	const queryData: any = {
		name,
		price,
		is_free,
		addon_ingredients: {
			create: ingredients,
		},
	};
	try {
		const newAddon = await prisma.addon.create({
			data: queryData,
		});
		return newAddon;
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const addLocationMenu = async (data: LocationMenu) => {
	validateLocationMenuInputs(data);
	const { location_id, menu_id, is_available, quantity } = data;

	try {
		const locationMenu = await prisma.locationMenu.create({
			data: {
				location_id,
				menu_id,
				is_available,
				quantity,
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

export const getLocationMenu = async (locationId: string, menuId?: string) => {
	try {
		const whereClause: any = {
			location_id: locationId,
		};

		if (menuId) {
			whereClause.menu_id = menuId;
		}

		const locationMenu = await prisma.locationMenu.findMany({
			where: whereClause,
			include: {
				menu: {
					include: {
						menu_ingredients: {
							include: {
								ingredient: true,
							},
						},
					},
				},
			},
		});
		return locationMenu;
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const addLocationIngredient = async (data: LocationIngredient[]) => {
	if (!Array.isArray(data) || data.length === 0) {
		throw new Error("Ingredients data required!");
	}

	try {
		const results = await Promise.all(
			data.map((ingredient) =>
				prisma.locationIngredient.upsert({
					where: {
						location_id_ingredient_id: {
							location_id: ingredient.location_id,
							ingredient_id: ingredient.ingredient_id,
						},
					},
					update: {
						quantity: ingredient.quantity,
						unit: ingredient.unit,
					},
					create: ingredient,
					include: {
						location: true,
						ingredient: true,
					},
				})
			)
		);
		return results;
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const getAllIngredients = async () => {
	try {
		return await prisma.ingredient.findMany();
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const getLocationIngredients = async (locationId: string) => {
	try {
		return await prisma.locationIngredient.findMany({
			where: {
				location_id: locationId,
			},
			include: {
				location: true,
				ingredient: true,
			},
		});
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const getMenuReceipe = async (MenuId: string) => {
	try {
		return await prisma.menuIngredient.findMany({
			where: {
				menu_id: MenuId,
			},
		});
	} catch (err: any) {
		throw new prismaError(err);
	}
};
