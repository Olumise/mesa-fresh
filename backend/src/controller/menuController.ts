import { Request, Response, NextFunction } from "express";
import {
	addIngredients,
	addLocationIngredient,
	addLocationMenu,
	addMenuCategory,
	addNewAddon,
	addNewMenu,
	getAllIngredients,
	getAllMenu,
	getLocationIngredients,
	getLocationMenu,
	getMenuReceipe,
} from "../services/menu.js";
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
		const { menu_id } = req.query;
		if (!locationId) {
			throw new Error("Location Id is required!");
		}
		const locationMenus = await getLocationMenu(locationId, menu_id as string | undefined);
		res.json({
			no_of_menu: locationMenus.length,
			data: locationMenus,
		});
	} catch (err) {
		next(err);
	}
};

export const addIngredientsController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const newIngredient = await addIngredients(req.body);
		res.json({
			message: "New Ingredients added successfully",
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
	const { locationId } = req.params;
	if (!locationId) {
		throw new AppError(400, "Location ID is required!");
	}

	const ingredientsArray = Array.isArray(req.body) ? req.body : [req.body];
	const ingredientsData = ingredientsArray.map((ing) => ({
		...ing,
		location_id: locationId,
	}));

	try {
		const locationIngredients = await addLocationIngredient(ingredientsData);
		res.json({
			message: `New Ingredients added successfully!`,
			data: locationIngredients,
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
		const { locationId } = req.params;
		if (!locationId) {
			throw new Error("Location Id is required!");
		}
		const ingredients = await getLocationIngredients(locationId);
		res.json({
			no_of_ingredients: ingredients.length,
			data: ingredients,
		});
	} catch (err) {
		next(err);
	}
};

export const getMenuReceipeController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { menuId } = req.params;
		if (!menuId) {
			throw new AppError(400, "menuId is required!");
		}
		const receipes = await getMenuReceipe(menuId);
		res.send(receipes);
	} catch (err) {
		next(err);
	}
};
