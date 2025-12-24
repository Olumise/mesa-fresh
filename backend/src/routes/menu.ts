import express from "express";
import {
	addAddonController,
	addIngredientController,
	addLocationIngredientController,
	addLocationMenuController,
	addMenuCategoryController,
	addMenuController,
	getAllIngredientsController,
	getAllMenuController,
	getLocationIngredientsController,
	getLocationMenuController,
} from "../controller/menuController.js";
import { dbRoleVerify } from "../middlewares/dbRoleVerify.js";
import { authVerify } from "../middlewares/authVerify.js";
import { locationVerify } from "../middlewares/locationVerify.js";
import { staffRoleVerify } from "../middlewares/staffRoleVerify.js";
import { auth } from "../lib/auth.js";
const menuRouter = express();

menuRouter.post(
	"/add-category",
	dbRoleVerify("Admin"),
	addMenuCategoryController
);
menuRouter.post(
	"/add-menu",
	authVerify,
	dbRoleVerify("Admin"),
	addMenuController
);
menuRouter.post(
	"/add-addon",
	authVerify,
	dbRoleVerify("Admin"),
	addAddonController
);
menuRouter.get(
	"/all-menu",
	authVerify,
	dbRoleVerify("Admin"),
	getAllMenuController
);
menuRouter.post(
	"/:locationId/add-location-menu",
	authVerify,
	locationVerify,
	staffRoleVerify("Manager"),
	addLocationMenuController
);
menuRouter.get(
	"/location-menu/:locationId",
	authVerify,
	locationVerify,
	getLocationMenuController
);
menuRouter.post(
	"/add-ingredient",
	authVerify,
	dbRoleVerify("Admin"),
	addIngredientController
);
menuRouter.get("/all-ingredients", authVerify, getAllIngredientsController);
menuRouter.post(
	"/:locationId/add-location-ingredient",
	authVerify,
	locationVerify,
	staffRoleVerify("Manager"),
	addLocationIngredientController
);
menuRouter.get(
	"/location-ingredient/:locationMenuId",
	authVerify,
	getLocationIngredientsController
);

export default menuRouter;
