-- CreateTable
CREATE TABLE "menu_ingredient" (
    "menu_id" TEXT NOT NULL,
    "ingredient_id" TEXT NOT NULL,
    "ingredient_per_unit" INTEGER NOT NULL,
    "unit" "IngredientUnit" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "menu_ingredient_menu_id_ingredient_id_key" ON "menu_ingredient"("menu_id", "ingredient_id");

-- AddForeignKey
ALTER TABLE "menu_ingredient" ADD CONSTRAINT "menu_ingredient_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_ingredient" ADD CONSTRAINT "menu_ingredient_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
