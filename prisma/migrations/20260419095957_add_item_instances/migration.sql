/*
  Warnings:

  - You are about to drop the column `availability` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `availableQuantity` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `borrowedAt` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `borrowedById` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `borrowedReminderSent` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `takenAt` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `takenById` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `takenReminderSent` on the `Item` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ItemHistoryAction" ADD VALUE 'condition_change';

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_borrowedById_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_takenById_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "availability",
DROP COLUMN "availableQuantity",
DROP COLUMN "borrowedAt",
DROP COLUMN "borrowedById",
DROP COLUMN "borrowedReminderSent",
DROP COLUMN "status",
DROP COLUMN "takenAt",
DROP COLUMN "takenById",
DROP COLUMN "takenReminderSent";

-- AlterTable
ALTER TABLE "ItemHistory" ADD COLUMN     "conditionSnapshot" "ItemCondition",
ADD COLUMN     "instanceId" TEXT;

-- CreateTable
CREATE TABLE "ItemInstance" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "condition" "ItemCondition" NOT NULL DEFAULT 'good',
    "availability" "Availability" NOT NULL DEFAULT 'available',
    "borrowedById" TEXT,
    "borrowedAt" TIMESTAMP(3),
    "borrowedReminderSent" BOOLEAN NOT NULL DEFAULT false,
    "takenById" TEXT,
    "takenAt" TIMESTAMP(3),
    "takenReminderSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemInstance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItemInstance" ADD CONSTRAINT "ItemInstance_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemInstance" ADD CONSTRAINT "ItemInstance_borrowedById_fkey" FOREIGN KEY ("borrowedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemInstance" ADD CONSTRAINT "ItemInstance_takenById_fkey" FOREIGN KEY ("takenById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemHistory" ADD CONSTRAINT "ItemHistory_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "ItemInstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
