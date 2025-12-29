import express from "express";
import { createOrderController } from "../controller/orderController.js";
import { authVerify } from "../middlewares/authVerify.js";
import { locationVerify } from "../middlewares/locationVerify.js";
import { staffRoleVerify } from "../middlewares/staffRoleVerify.js";

const orderRouter = express();

orderRouter.post(
	"/:locationId/create",
	authVerify,
	locationVerify,
	staffRoleVerify(["Manager","Cashier"]),
	createOrderController
);

export default orderRouter;
