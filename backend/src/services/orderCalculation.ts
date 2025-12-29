import { OrderItem } from "../schemas/order";
import Decimal from "decimal.js";

interface MenuPriceInfo {
	menu_id: string;
	price: Decimal;
}

interface AddonPriceInfo {
	addon_id: string;
	price: Decimal;
	is_free: boolean;
}

interface AddonCalculation {
	addon_id: string;
	quantity: number;
	unit_price: Decimal;
	subtotal: Decimal;
}

interface ItemCalculation {
	menu_id: string;
	quantity: number;
	unit_price: Decimal;
	item_subtotal: Decimal;
	addons: AddonCalculation[];
	total_with_addons: Decimal;
}

interface OrderCalculation {
	items: ItemCalculation[];
	subtotal: Decimal;
	tax: Decimal;
	total: Decimal;
}

const TAX_RATE = new Decimal(0.075);

export const calculateOrderTotals = (
	items: OrderItem[],
	menuPrices: Map<string, Decimal>,
	addonPrices: Map<string, { price: Decimal; is_free: boolean }>
): OrderCalculation => {
	const itemCalculations: ItemCalculation[] = [];

	for (const item of items) {
		const menuPrice = menuPrices.get(item.menu_id);
		if (!menuPrice) {
			throw new Error(`Menu price for ${item.menu_id} not found`);
		}

		const itemQuantity = new Decimal(item.quantity);
		const itemSubtotal = menuPrice.mul(itemQuantity);

		const addonCalculations: AddonCalculation[] = [];
		let addonsTotal = new Decimal(0);

		if (item.addons && item.addons.length > 0) {
			for (const addon of item.addons) {
				const addonInfo = addonPrices.get(addon.addon_id);
				if (!addonInfo) {
					throw new Error(`Addon price for ${addon.addon_id} not found`);
				}

				const addonPrice = addonInfo.is_free
					? new Decimal(0)
					: addonInfo.price;
				const addonQuantity = new Decimal(addon.quantity);
				const addonSubtotal = addonPrice.mul(addonQuantity);

				addonCalculations.push({
					addon_id: addon.addon_id,
					quantity: addon.quantity,
					unit_price: addonPrice,
					subtotal: addonSubtotal,
				});

				addonsTotal = addonsTotal.add(addonSubtotal);
			}
		}

		const totalWithAddons = itemSubtotal.add(addonsTotal);

		itemCalculations.push({
			menu_id: item.menu_id,
			quantity: item.quantity,
			unit_price: menuPrice,
			item_subtotal: itemSubtotal,
			addons: addonCalculations,
			total_with_addons: totalWithAddons,
		});
	}

	const subtotal = itemCalculations.reduce(
		(sum, item) => sum.add(item.total_with_addons),
		new Decimal(0)
	);

	const tax = subtotal.mul(TAX_RATE);
	const total = subtotal.add(tax);

	return {
		items: itemCalculations,
		subtotal,
		tax,
		total,
	};
};
