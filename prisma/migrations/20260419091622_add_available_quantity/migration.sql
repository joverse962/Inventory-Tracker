/*
  Warnings:

  - You are about to drop the column `barcode` on the `Item` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Item_barcode_key";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "barcode",
ADD COLUMN     "availableQuantity" INTEGER NOT NULL DEFAULT 1;
