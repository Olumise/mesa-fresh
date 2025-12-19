/*
  Warnings:

  - Added the required column `location_id` to the `staff_invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "staff_invitation" ADD COLUMN     "location_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "staff_invitation" ADD CONSTRAINT "staff_invitation_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
