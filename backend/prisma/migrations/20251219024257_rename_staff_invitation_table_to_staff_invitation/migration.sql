/*
  Warnings:

  - You are about to drop the `StaffInvitation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StaffInvitation" DROP CONSTRAINT "StaffInvitation_invited_by_fkey";

-- DropForeignKey
ALTER TABLE "staffs" DROP CONSTRAINT "staffs_invitation_id_fkey";

-- DropTable
DROP TABLE "StaffInvitation";

-- CreateTable
CREATE TABLE "staff_invitation" (
    "id" TEXT NOT NULL,
    "invited_by" TEXT NOT NULL,
    "invited_email" TEXT NOT NULL,
    "invitation_code" TEXT NOT NULL,
    "is_accepted" BOOLEAN NOT NULL DEFAULT false,
    "accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_invitation_invited_email_key" ON "staff_invitation"("invited_email");

-- CreateIndex
CREATE UNIQUE INDEX "staff_invitation_invitation_code_key" ON "staff_invitation"("invitation_code");

-- AddForeignKey
ALTER TABLE "staff_invitation" ADD CONSTRAINT "staff_invitation_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffs" ADD CONSTRAINT "staffs_invitation_id_fkey" FOREIGN KEY ("invitation_id") REFERENCES "staff_invitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
