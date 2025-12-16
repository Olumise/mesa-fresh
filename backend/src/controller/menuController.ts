import { Request, Response, NextFunction } from "express";
import {
	addLocationMenu,
	addMenuCategory,
	addNewAddon,
	addNewMenu,
	getAllMenu,
	getLocationMenu,
} from "../services/menu.js";

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
	try {
		const newLocationMenu = await addLocationMenu(req.body);
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
		const locationMenus = await getLocationMenu(locationId);
		res.json({
			no_of_menu: locationMenus.length,
			data: locationMenus,
		});
	} catch (err) {
		next(err);
	}
};
