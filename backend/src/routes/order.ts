import express from "express";
import {
	createOrderController,
	updateOrderStatusController,
	cancelOrderController,
	getLocationOrdersController,
	updatePaymentStatusController
} from "../controller/orderController.js";
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

orderRouter.patch(
	"/:locationId/:orderId/status",
	authVerify,
	locationVerify,
	staffRoleVerify(["Manager","Cashier"]),
	updateOrderStatusController
);

orderRouter.patch(
	"/:locationId/:orderId/cancel",
	authVerify,
	locationVerify,
	staffRoleVerify(["Manager","Cashier"]),
	cancelOrderController
);

orderRouter.get(
	"/:locationId/orders",
	authVerify,
	locationVerify,
	staffRoleVerify(["Manager","Cashier"]),
	getLocationOrdersController
);

orderRouter.patch(
	"/:locationId/:orderId/payment",
	authVerify,
	locationVerify,
	staffRoleVerify(["Manager","Cashier"]),
	updatePaymentStatusController
);

export default orderRouter;
