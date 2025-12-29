import { Prisma } from "../../generated/prisma/client.js";
import { validateCreateOrderInput } from "../lib/validate.js";
import { CreateOrder } from "../schemas/order.js";
import { prismaError } from "prisma-better-errors";
import prisma from "../lib/prisma.js";
import { AppError } from "../middlewares/errorHandler.js";
import { calculateOrderTotals } from "./orderCalculation.js";
import Decimal from "decimal.js";

export const createOrder = async (order: CreateOrder, locationId: string, createdById: string) => {
	validateCreateOrderInput(order);
	const { items, customer_id, customer_name, notes, payment } = order;
	try {
		if (!Array.isArray(items) || items.length === 0) {
			throw new AppError(400, "Menu Items empty!");
		}

		if (!customer_id && !customer_name) {
			throw new AppError(400, "Either customer_id or customer_name is required!");
		}

		const menuPrices = new Map<string, Decimal>();
		const addonPrices = new Map<string, { price: Decimal; is_free: boolean }>();

		//1. Validate menus and collect prices
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

				menuPrices.set(menu.menu_id, new Decimal(locationMenu.menu.price.toString()));
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
								const totalQuantityNeeded = addonIng.quantity * addonCalc.quantity;

								const locationIngredient = await tx.locationIngredient.findUnique({
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

			return orderCreated;
		})
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			throw new prismaError(err);
		}
		throw new Error(err);
	}
};
