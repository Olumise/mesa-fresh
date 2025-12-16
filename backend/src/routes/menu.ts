import express from "express";
import {
	addAddonController,
	addLocationMenuController,
	addMenuCategoryController,
	addMenuController,
	getAllMenuController,
	getLocationMenuController,
} from "../controller/menuController.js";
const menuRouter = express();

menuRouter.post("/add-category", addMenuCategoryController);
menuRouter.post("/add-menu", addMenuController);
menuRouter.post("/add-addon", addAddonController);
menuRouter.get("/all-menu", getAllMenuController);
menuRouter.post("/add-location-menu", addLocationMenuController);
menuRouter.get("/location-menu/:locationId", getLocationMenuController);

export default menuRouter;
