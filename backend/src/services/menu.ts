import prisma from "../lib/prisma";
import {
	Menu,
	MenuCategory,
	LocationMenu,
} from "../../generated/prisma/client";
import {
	validateMenuInput,
	validateMenuWithCategoryInput,
	validateLocationMenuInputs,
} from "../lib/helper";

export interface MenuWithCategory extends Omit<Menu, "category_id"> {
	category_name: string;
	category_description?: string;
}

const addMenuCategory = async (data: MenuCategory) => {
	const { name, description } = data;
	if (!name) {
		throw new Error("Category Name is required!");
	}
	const newCategory = await prisma.menuCategory.create({
		data,
	});
	return newCategory;
};

const addNewMenu = async (data: Menu) => {
	validateMenuInput(data);
	const {
		name,
		price,
		description,
		image,
		category_id,
		calories,
		prep_time,
		is_customizable,
	} = data;
	const newMenu = await prisma.menu.create({
		data,
	});
	return newMenu;
};

const addNewMenuWithCategory = async (data: MenuWithCategory) => {
	const {
		name,
		price,
		description,
		image,
		calories,
		prep_time,
		category_name,
		category_description,
		is_customizable,
	} = data;

	validateMenuWithCategoryInput(data);
	const newMenu = await prisma.menu.create({
		data: {
			name,
			price,
			description,
			image,
			calories,
			prep_time,
			is_customizable,
			category: {
				create: {
					name: category_name,
					description: category_description || null,
				},
			},
		},
	});

	return newMenu;
};

const getAllMenu = async () => {
	const allMenu = await prisma.menu.findMany();
	return allMenu;
};

const addLocationMenu = async (data: LocationMenu) => {
	const { location_id, menu_id, is_available, quantity } = data;
	validateLocationMenuInputs(data);
	const newLocationMenu = await prisma.locationMenu.create({
		data,
	});
	return newLocationMenu;
};

const getLocationMenu = async (locationId:string)=>{
    if(!locationId){
        throw
    }
} 