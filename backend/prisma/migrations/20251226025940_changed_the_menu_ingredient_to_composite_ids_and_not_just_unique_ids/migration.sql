/*
  Warnings:

  - You are about to drop the column `ingredient_per_unit` on the `menu_ingredient` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `menu_ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "menu_ingredient" DROP COLUMN "ingredient_per_unit",
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD CONSTRAINT "menu_ingredient_pkey" PRIMARY KEY ("menu_id", "ingredient_id");

-- DropIndex
DROP INDEX "menu_ingredient_menu_id_ingredient_id_key";
