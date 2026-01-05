import { z } from "zod";
export const IngredientUnitSchema = z.enum([
	"GRAM",
	"KILOGRAM",
	"MILLILITER",
	"LITER",
	"PIECE",
	"SLICE",
	"CLOVE",
	"LEAF",
]);
const ingredientMenuSchema = z.object({
	ingredient_id: z.string("Ingredient Id should be a string!"),
	quantity: z.number("Ingredient per unit should be a number!"),
	unit: IngredientUnitSchema,
});

export const MenuSchema = z
	.object({
		name: z.string("Name should be a string").min(1, "Menu name is required"),

		price: z
			.number("Price should be a number")
			.positive("Price must be greater than zero"),

		description: z
			.string("Description should be a string")
			.min(1, "Menu description is required"),

		image: z
			.string("Image should be a string")
			.url("Image should be a valid URL"),

		category_id: z
			.string("Category ID should be a string")
			.uuid("Category ID should be a valid UUID")
			.optional(),

		calories: z
			.number("Calories should be a number")
			.int("Calories should be an integer")
			.nonnegative("Calories cannot be negative"),

		prep_time: z
			.string("Prep time should be a string")
			.min(1, "Prep time is required"),

		is_customizable: z.boolean("Is customizable should be a boolean"),

		category_name: z.string("Category Name should be a string").optional(),

		category_description: z.string("Category ID should be a string").optional(),

		category_color: z.string("Category Color should be a string").optional(),

		ingredients: z.array(ingredientMenuSchema),
	})
	.refine(
		(data) => {
			return !!data.category_id || !!data.category_name;
		},
		{
			message: "Category Id or Category Name is required",
			path: ["category_id"],
		}
	);

export const MenuCategorySchema = z.object({
	name: z.string("Name should be a string").min(1, "Category name is required"),

	description: z.string("Description should be a string").optional(),

	color: z.string("Color should be a string").min(1, "Category color is required"),
});

export const AddonSchema = z
	.object({
		name: z.string("Name should be a string").min(1, "Addon name is required"),

		price: z
			.number("Price should be a number")
			.nonnegative("Price cannot be negative"),

		is_free: z.boolean("Is free should be a boolean"),
		ingredients: z.array(ingredientMenuSchema),
	})
	.refine((data) => !(data.is_free && data.price > 0), {
		message: "Free addons cannot have a price",
	});

export const LocationMenuSchema = z.object({
	location_id: z
		.string("Location ID should be a string")
		.uuid("Location ID should be a valid UUID"),

	menu_id: z
		.string("Menu ID should be a string")
		.uuid("Menu ID should be a valid UUID"),

	is_available: z.boolean("Is available should be a boolean"),

	quantity: z
		.number("Quantity should be a number")
		.int("Quantity should be an integer")
		.nonnegative("Quantity cannot be negative"),
});

export const LocationIngredientSchema = z.object({
	location_id: z
		.string("Location ID should be a string")
		.uuid("Location ID should be a valid UUID"),

	ingredient_id: z
		.string("Ingredient ID should be a string")
		.uuid("Ingredient ID should be a valid UUID"),

	quantity: z
		.number("Quantity should be a number")
		.int("Quantity should be an integer")
		.nonnegative("Quantity cannot be negative"),

	unit: IngredientUnitSchema,
});

export const MenuSchemaCreate = MenuSchema;
export const MenuAndCategorySchemaCreate = MenuSchema.omit({
	category_id: true,
}).extend({
	category_name: z
		.string("Category Name should be a string")
		.min(1, "Category Name is required"),
	category_description: z.string("Category Description should be a string")
		.optional,
});
export const CreateMenuCategorySchema = MenuCategorySchema;
export const UpdateMenuCategorySchema = CreateMenuCategorySchema.partial();
export const CreateAddonSchema = AddonSchema;
export const UpdateAddonSchema = CreateAddonSchema.partial();
export const CreateLocationMenuSchema = LocationMenuSchema;
export const UpdateLocationMenuSchema = CreateLocationMenuSchema.partial();
export const CreateLocationIngredientSchema = LocationIngredientSchema;
export const UpdateLocationIngredientSchema =
	CreateLocationIngredientSchema.partial();
