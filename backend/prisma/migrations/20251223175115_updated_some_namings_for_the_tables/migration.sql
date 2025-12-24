/*
  Warnings:

  - The primary key for the `location_ingredients` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "location_ingredients" DROP CONSTRAINT "location_ingredients_pkey",
ADD CONSTRAINT "location_ingredients_pkey" PRIMARY KEY ("location_menu_id", "ingredient_id");
