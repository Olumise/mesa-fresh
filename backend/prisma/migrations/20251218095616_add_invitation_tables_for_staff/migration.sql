/*
  Warnings:

  - A unique constraint covering the columns `[invitation_id]` on the table `staffs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invitation_id` to the `staffs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "staffs" ADD COLUMN     "invitation_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "StaffInvitation" (
    "id" TEXT NOT NULL,
    "invited_by" TEXT NOT NULL,
    "invited_email" TEXT NOT NULL,
    "invitation_code" TEXT NOT NULL,
    "is_accepted" BOOLEAN NOT NULL DEFAULT false,
    "accepted_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffInvitation_invited_email_key" ON "StaffInvitation"("invited_email");

-- CreateIndex
CREATE UNIQUE INDEX "StaffInvitation_invitation_code_key" ON "StaffInvitation"("invitation_code");

-- CreateIndex
CREATE UNIQUE INDEX "staffs_invitation_id_key" ON "staffs"("invitation_id");

-- AddForeignKey
ALTER TABLE "StaffInvitation" ADD CONSTRAINT "StaffInvitation_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffs" ADD CONSTRAINT "staffs_invitation_id_fkey" FOREIGN KEY ("invitation_id") REFERENCES "StaffInvitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
