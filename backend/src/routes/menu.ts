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
const menuRouter = express();

menuRouter.post("/add-category", addMenuCategoryController);
menuRouter.post("/add-menu", addMenuController);
menuRouter.post("/add-addon", addAddonController);
menuRouter.get("/all-menu", getAllMenuController);
menuRouter.post("/add-location-menu", addLocationMenuController);
menuRouter.get("/location-menu/:locationId", getLocationMenuController);
menuRouter.post("/add-ingredient", addIngredientController);
menuRouter.get("/all-ingredients", getAllIngredientsController);
menuRouter.post("/add-location-ingredient", addLocationIngredientController);
menuRouter.get(
	"/location-ingredient/:locationMenuId",
	getLocationIngredientsController
);

export default menuRouter;
