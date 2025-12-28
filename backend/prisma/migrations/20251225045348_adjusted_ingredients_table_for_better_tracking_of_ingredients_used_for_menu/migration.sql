/*
  Warnings:

  - The primary key for the `location_ingredients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `location_menu_id` on the `location_ingredients` table. All the data in the column will be lost.
  - Added the required column `location_id` to the `location_ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IngredientTrackingType" AS ENUM ('PRECISE', 'ESTIMATED');

-- DropForeignKey
ALTER TABLE "location_ingredients" DROP CONSTRAINT "location_ingredients_location_menu_id_fkey";

-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "estimated_usage_per_100_orders" INTEGER,
ADD COLUMN     "tracking_type" "IngredientTrackingType" NOT NULL DEFAULT 'PRECISE';

-- AlterTable
ALTER TABLE "location_ingredients" DROP CONSTRAINT "location_ingredients_pkey",
DROP COLUMN "location_menu_id",
ADD COLUMN     "location_id" TEXT NOT NULL,
ADD CONSTRAINT "location_ingredients_pkey" PRIMARY KEY ("location_id", "ingredient_id");

-- CreateTable
CREATE TABLE "addon_ingredients" (
    "addon_id" TEXT NOT NULL,
    "ingredient_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" "IngredientUnit" NOT NULL,

    CONSTRAINT "addon_ingredients_pkey" PRIMARY KEY ("addon_id","ingredient_id")
);

-- AddForeignKey
ALTER TABLE "addon_ingredients" ADD CONSTRAINT "addon_ingredients_addon_id_fkey" FOREIGN KEY ("addon_id") REFERENCES "addons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addon_ingredients" ADD CONSTRAINT "addon_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_ingredients" ADD CONSTRAINT "location_ingredients_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
