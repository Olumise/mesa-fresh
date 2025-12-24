import { Request, Response, NextFunction } from "express";
import {
	addIngredient,
	addLocationIngredient,
	addLocationMenu,
	addMenuCategory,
	addNewAddon,
	addNewMenu,
	getAllIngredients,
	getAllMenu,
	getLocationIngredients,
	getLocationMenu,
} from "../services/menu.js";
import prisma from "../lib/prisma.js";
import { AppError } from "../middlewares/errorHandler.js";

export const addMenuCategoryController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const newCategory = await addMenuCategory(req.body);
		res.json({
			message: "Category created successfully!",
			data: newCategory,
		});
	} catch (err) {
		next(err);
	}
};

export const addMenuController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const newMenu = await addNewMenu(req.body);
		res.json({
			message: "Menu created successfully!",
			data: newMenu,
		});
	} catch (err) {
		next(err);
	}
};

export const addAddonController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const newAddon = await addNewAddon(req.body);
		res.json({
			message: "New Addon created successfully!",
			data: newAddon,
		});
	} catch (err) {
		next(err);
	}
};

export const getAllMenuController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const allMenu = await getAllMenu();
		res.json({
			no_of_menus: allMenu.length,
			data: allMenu,
		});
	} catch (err) {
		next(err);
	}
};

export const addLocationMenuController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { locationId } = req.params;
	if (!locationId) {
		throw new Error("No Location id found!");
	}
	const { menu_id, is_available, quantity } = req.body;
	const data: any = {
		menu_id,
		is_available,
		quantity,
		location_id: locationId,
	};
	try {
		const newLocationMenu = await addLocationMenu(data);
		res.json({
			message: `New Menu has been added to the ${newLocationMenu.location.name} location!`,
			data: newLocationMenu,
		});
	} catch (err) {
		next(err);
	}
};

export const getLocationMenuController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { locationId } = req.params;
		if (!locationId) {
			throw new Error("Location Id is required!");
		}
		const locationMenus = await getLocationMenu(locationId);
		res.json({
			no_of_menu: locationMenus.length,
			data: locationMenus,
		});
	} catch (err) {
		next(err);
	}
};

export const addIngredientController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const newIngredient = await addIngredient(req.body);
		res.json({
			message: "New Ingredient added successfully",
			data: newIngredient,
		});
	} catch (err) {
		next(err);
	}
};

export const addLocationIngredientController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { location_menu_id } = req.body;
	const userInfo = req.user?.user;
	if (!userInfo?.id) {
		throw new AppError(401, "Unauthorized User!");
	}

	try {
		const locMenu = await prisma.locationMenu.findUnique({
			where: {
				id: location_menu_id,
			},
		});
		if (!locMenu) {
			throw new AppError(404, "Location Menu not found!");
		}
		const staff = await prisma.staff.findFirst({
			where: {
				user_id: userInfo?.id,
				location_id: locMenu.location_id,
			},
		});
		if (!staff) {
			throw new AppError(403, "User not assigned to this Location");
		}
		const locationIngredient = await addLocationIngredient(req.body);
		res.json({
			message: `New Ingredient added for the ${locationIngredient.location_menu.menu.name} menu in the ${locationIngredient.location_menu.location.name} location !`,
			data: locationIngredient,
		});
	} catch (err: any) {
		next(err);
	}
};

export const getAllIngredientsController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const allIngredients = await getAllIngredients();
		res.json({
			no_of_ingredients: allIngredients.length,
			data: allIngredients,
		});
	} catch (err: any) {
		next(err);
	}
};

export const getLocationIngredientsController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { locationMenuId } = req.params;
		if (!locationMenuId) {
			throw new Error("LocationMenuId is required!");
		}
		const ingredients = await getLocationIngredients(locationMenuId);
		res.json({
			no_of_ingredients: ingredients.length,
			data: ingredients,
		});
	} catch (err) {
		next(err);
	}
};
