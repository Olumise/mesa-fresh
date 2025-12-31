import { Prisma } from "../../generated/prisma/client.js";
import { validateCreateOrderInput, validateUpdatePaymentStatus } from "../lib/validate.js";
import {
	CreateOrder,
	UpdateOrderStatus,
	CancelOrder,
	OrderStatusSchema,
	UpdatePaymentStatus,
} from "../schemas/order.js";
import { prismaError } from "prisma-better-errors";
import prisma from "../lib/prisma.js";
import { AppError } from "../middlewares/errorHandler.js";
import { calculateOrderTotals } from "./orderCalculation.js";
import Decimal from "decimal.js";

export const createOrder = async (
	order: CreateOrder,
	locationId: string,
	createdById: string
) => {
	validateCreateOrderInput(order);
	const { items, customer_id, customer_name, notes, payment } = order;
	const PaymentMethods = ["POS", "TRANSFER", "CASH"];
	if (!payment?.payment_method) {
		throw new AppError(400, "Payment Method required!");
	}
	if (!PaymentMethods.includes(payment?.payment_method)) {
		throw new AppError(
			400,
			`Payment method not valid! Allowed methods include ${PaymentMethods.join(
				","
			)}`
		);
	}
	try {
		if (!Array.isArray(items) || items.length === 0) {
			throw new AppError(400, "Menu Items empty!");
		}

		if (!customer_id && !customer_name) {
			throw new AppError(
				400,
				"Either customer_id or customer_name is required!"
			);
		}

		const menuPrices = new Map<string, Decimal>();
		const addonPrices = new Map<string, { price: Decimal; is_free: boolean }>();

		await Promise.all(
			items.map(async (menu) => {
				const locationMenu = await prisma.locationMenu.findUnique({
					where: {
						location_id_menu_id: {
							location_id: locationId,
							menu_id: menu.menu_id,
						},
					},
					include: {
						menu: true,
					},
				});
				if (!locationMenu) {
					throw new AppError(
						400,
						`Menu ${menu.menu_id} does not exist for this location!`
					);
				}
				if (!locationMenu.is_available) {
					throw new AppError(
						400,
						`${locationMenu.menu.name} is not available right now!`
					);
				}
				if (menu.quantity > locationMenu.quantity) {
					throw new AppError(
						400,
						`${locationMenu.menu.name} quantity is not enough for this order!`
					);
				}

				menuPrices.set(
					menu.menu_id,
					new Decimal(locationMenu.menu.price.toString())
				);
			})
		);

		await Promise.all(
			items.map(async (item) => {
				if (item.addons && item.addons.length > 0) {
					await Promise.all(
						item.addons.map(async (addon) => {
							const addonInfo = await prisma.menuAddon.findUnique({
								where: {
									menu_id_addon_id: {
										menu_id: item.menu_id,
										addon_id: addon.addon_id,
									},
								},
								include: {
									addon: true,
								},
							});
							if (!addonInfo) {
								throw new AppError(
									400,
									`Addon ${addon.addon_id} does not exist or is not available for this menu item`
								);
							}

							addonPrices.set(addon.addon_id, {
								price: new Decimal(addonInfo.addon.price.toString()),
								is_free: addonInfo.addon.is_free,
							});
						})
					);
				}
			})
		);

		const calculations = calculateOrderTotals(items, menuPrices, addonPrices);
		console.log(calculations.total);
		return prisma.$transaction(async (tx) => {
			const orderCreated = await tx.order.create({
				data: {
					location_id: locationId,
					customer_id: customer_id || null,
					customer_name: customer_name || null,
					created_by_id: createdById,
					notes: notes || null,
					subtotal: calculations.subtotal,
					tax: calculations.tax,
					total: calculations.total,
					order_number: `ORD-${Date.now()}`,
				},
			});

			for (const itemCalc of calculations.items) {
				const item = items.find((i) => i.menu_id === itemCalc.menu_id);
				if (!item) continue;

				const orderItem = await tx.orderItem.create({
					data: {
						order_id: orderCreated.id,
						menu_id: itemCalc.menu_id,
						quantity: itemCalc.quantity,
						unit_price: itemCalc.unit_price,
						subtotal: itemCalc.total_with_addons,
						special_notes: item.special_notes || null,
					},
				});

				const menuIngredients = await tx.menuIngredient.findMany({
					where: { menu_id: itemCalc.menu_id },
					include: { ingredient: true },
				});

				for (const menuIng of menuIngredients) {
					if (menuIng.ingredient.tracking_type === "PRECISE") {
						const totalQuantityNeeded = menuIng.quantity * itemCalc.quantity;

						const locationIngredient = await tx.locationIngredient.findUnique({
							where: {
								location_id_ingredient_id: {
									location_id: locationId,
									ingredient_id: menuIng.ingredient_id,
								},
							},
						});

						if (!locationIngredient) {
							await tx.locationIngredient.create({
								data: {
									location_id: locationId,
									ingredient_id: menuIng.ingredient_id,
									quantity: totalQuantityNeeded,
									unit: menuIng.unit,
								},
							});
						} else if (locationIngredient.quantity < totalQuantityNeeded) {
							await tx.locationIngredient.update({
								where: {
									location_id_ingredient_id: {
										location_id: locationId,
										ingredient_id: menuIng.ingredient_id,
									},
								},
								data: {
									quantity: totalQuantityNeeded,
								},
							});
						} else {
							await tx.locationIngredient.update({
								where: {
									location_id_ingredient_id: {
										location_id: locationId,
										ingredient_id: menuIng.ingredient_id,
									},
								},
								data: {
									quantity: {
										decrement: totalQuantityNeeded,
									},
								},
							});
						}
					}
				}

				if (itemCalc.addons.length > 0) {
					for (const addonCalc of itemCalc.addons) {
						await tx.orderItemAddon.create({
							data: {
								order_item_id: orderItem.id,
								addon_id: addonCalc.addon_id,
								quantity: addonCalc.quantity,
								unit_price: addonCalc.unit_price,
								subtotal: addonCalc.subtotal,
							},
						});

						const addonIngredients = await tx.addonIngredient.findMany({
							where: { addon_id: addonCalc.addon_id },
							include: { ingredient: true },
						});

						for (const addonIng of addonIngredients) {
							if (addonIng.ingredient.tracking_type === "PRECISE") {
								const totalQuantityNeeded =
									addonIng.quantity * addonCalc.quantity;

								const locationIngredient =
									await tx.locationIngredient.findUnique({
										where: {
											location_id_ingredient_id: {
												location_id: locationId,
												ingredient_id: addonIng.ingredient_id,
											},
										},
									});

								if (!locationIngredient) {
									await tx.locationIngredient.create({
										data: {
											location_id: locationId,
											ingredient_id: addonIng.ingredient_id,
											quantity: totalQuantityNeeded,
											unit: addonIng.unit,
										},
									});
								} else if (locationIngredient.quantity < totalQuantityNeeded) {
									await tx.locationIngredient.update({
										where: {
											location_id_ingredient_id: {
												location_id: locationId,
												ingredient_id: addonIng.ingredient_id,
											},
										},
										data: {
											quantity: totalQuantityNeeded,
										},
									});
								} else {
									await tx.locationIngredient.update({
										where: {
											location_id_ingredient_id: {
												location_id: locationId,
												ingredient_id: addonIng.ingredient_id,
											},
										},
										data: {
											quantity: {
												decrement: totalQuantityNeeded,
											},
										},
									});
								}
							}
						}
					}
				}
			}

			const newPayment = await tx.payment.create({
				data: {
					order_id: orderCreated.id,
					payment_method: payment.payment_method as any,
					amount: calculations.total,
					processed_by_id: createdById,
					payment_status:
						payment.payment_method === ("CASH" as any)
							? ("COMPLETED" as any)
							: ("PENDING" as any),
				},
			});

			return orderCreated;
		});
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			throw new prismaError(err);
		}
		throw new Error(err);
	}
};

export const updateOrderStatus = async (
	orderId: string,
	updateData: UpdateOrderStatus,
	changedById: string,
	locationId: string
) => {
	const orderStatus = [
		"PENDING",
		"PREPARING",
		"READY",
		"COMPLETED",
		"CANCELLED",
	];
	if (!orderStatus.includes(updateData.status)) {
		throw new AppError(
			404,
			`Status not valid! Allowed status includes ${orderStatus.join(",")}`
		);
	}
	try {
		const order = await prisma.order.findUnique({
			where: { id: orderId },
		});

		if (!order) {
			throw new AppError(404, "Order not found!");
		}

		if (order.location_id !== locationId) {
			throw new AppError(403, "You don't have access to this order!");
		}

		if (order.status === ("CANCELLED" as any)) {
			throw new AppError(400, "Cannot update a cancelled order!");
		}

		if (order.status === ("COMPLETED" as any)) {
			throw new AppError(400, "Cannot update a completed order!");
		}

		return prisma.$transaction(async (tx) => {
			const updatedOrder = await tx.order.update({
				where: { id: orderId },
				data: {
					status: updateData.status as any,
					completed_at:
						updateData.status === "COMPLETED" ? new Date() : order.completed_at,
				},
			});

			await tx.orderStatusHistory.create({
				data: {
					order_id: orderId,
					from_status: order.status,
					to_status: updateData.status as any,
					changed_by_id: changedById,
					notes: updateData.notes || null,
				},
			});

			return updatedOrder;
		});
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			throw new prismaError(err);
		}
		throw err;
	}
};

export const cancelOrder = async (
	orderId: string,
	cancelData: CancelOrder,
	cancelledById: string,
	locationId: string
) => {
	try {
		const order = await prisma.order.findUnique({
			where: { id: orderId },
			include: {
				order_items: {
					include: {
						order_item_addons: true,
					},
				},
			},
		});

		if (!order) {
			throw new AppError(404, "Order not found!");
		}

		if (order.location_id !== locationId) {
			throw new AppError(403, "You don't have access to this order!");
		}

		if (order.status === ("CANCELLED" as any)) {
			throw new AppError(400, "Order is already cancelled!");
		}

		if (order.status === ("COMPLETED" as any)) {
			throw new AppError(400, "Cannot cancel a completed order!");
		}

		return prisma.$transaction(async (tx) => {
			if (cancelData.restore_inventory) {
				for (const orderItem of order.order_items) {
					const menuIngredients = await tx.menuIngredient.findMany({
						where: { menu_id: orderItem.menu_id },
						include: { ingredient: true },
					});

					for (const menuIng of menuIngredients) {
						if (menuIng.ingredient.tracking_type === "PRECISE") {
							const totalQuantityToRestore =
								menuIng.quantity * orderItem.quantity;

							const locationIngredient = await tx.locationIngredient.findUnique(
								{
									where: {
										location_id_ingredient_id: {
											location_id: locationId,
											ingredient_id: menuIng.ingredient_id,
										},
									},
								}
							);

							if (locationIngredient) {
								await tx.locationIngredient.update({
									where: {
										location_id_ingredient_id: {
											location_id: locationId,
											ingredient_id: menuIng.ingredient_id,
										},
									},
									data: {
										quantity: {
											increment: totalQuantityToRestore,
										},
									},
								});
							}
						}
					}

					for (const orderItemAddon of orderItem.order_item_addons) {
						const addonIngredients = await tx.addonIngredient.findMany({
							where: { addon_id: orderItemAddon.addon_id },
							include: { ingredient: true },
						});

						for (const addonIng of addonIngredients) {
							if (addonIng.ingredient.tracking_type === "PRECISE") {
								const totalQuantityToRestore =
									addonIng.quantity * orderItemAddon.quantity;

								const locationIngredient =
									await tx.locationIngredient.findUnique({
										where: {
											location_id_ingredient_id: {
												location_id: locationId,
												ingredient_id: addonIng.ingredient_id,
											},
										},
									});

								if (locationIngredient) {
									await tx.locationIngredient.update({
										where: {
											location_id_ingredient_id: {
												location_id: locationId,
												ingredient_id: addonIng.ingredient_id,
											},
										},
										data: {
											quantity: {
												increment: totalQuantityToRestore,
											},
										},
									});
								}
							}
						}
					}
				}
			}

			const cancelledOrder = await tx.order.update({
				where: { id: orderId },
				data: {
					status: "CANCELLED" as any,
					cancelled_at: new Date(),
				},
			});

			await tx.orderStatusHistory.create({
				data: {
					order_id: orderId,
					from_status: order.status,
					to_status: "CANCELLED" as any,
					changed_by_id: cancelledById,
					notes: cancelData.reason || null,
				},
			});

			return cancelledOrder;
		});
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			throw new prismaError(err);
		}
		throw err;
	}
};

export const getLocationOrders = async (locationId: string) => {
	try {
		const orders = await prisma.order.findMany({
			where: {
				location_id: locationId,
			},
			include: {
				customer: {
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
					},
				},
				created_by: {
					select: {
						id: true,
						user: {
							select: {
								name: true,
								email: true,
							},
						},
					},
				},
				order_items: {
					include: {
						menu: {
							select: {
								id: true,
								name: true,
								price: true,
							},
						},
						order_item_addons: {
							include: {
								addon: {
									select: {
										id: true,
										name: true,
										price: true,
									},
								},
							},
						},
					},
				},
				payment: {
					select: {
						id: true,
						amount: true,
						payment_method: true,
						payment_status: true,
						transaction_ref: true,
						createdAt: true,
						completed_at: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return orders;
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			throw new prismaError(err);
		}
		throw err;
	}
};

export const updatePaymentStatus = async (
	orderId: string,
	updateData: UpdatePaymentStatus,
	locationId: string
) => {
	validateUpdatePaymentStatus(updateData);
	const { payment_status, transaction_ref } = updateData;

	try {
		const payment = await prisma.payment.findUnique({
			where: { order_id: orderId },
			include: {
				order: {
					select: {
						id: true,
						location_id: true,
						status: true,
					},
				},
			},
		});

		if (!payment) {
			throw new AppError(404, "Payment not found for this order!");
		}

		if (payment.order.location_id !== locationId) {
			throw new AppError(403, "You don't have access to this payment!");
		}

		if (payment.order.status === ("CANCELLED" as any)) {
			throw new AppError(400, "Cannot update payment for a cancelled order!");
		}

		const updatePayload: any = {
			payment_status: payment_status as any,
		};

		if (transaction_ref) {
			updatePayload.transaction_ref = transaction_ref;
		}

		if (payment_status === "COMPLETED") {
			updatePayload.completed_at = new Date();
		}

		const updatedPayment = await prisma.payment.update({
			where: { order_id: orderId },
			data: updatePayload,
			include: {
				order: {
					select: {
						id: true,
						order_number: true,
						total: true,
					},
				},
			},
		});

		return updatedPayment;
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			throw new prismaError(err);
		}
		throw err;
	}
};
