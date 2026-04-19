-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('available', 'borrowed', 'taken', 'waste', 'need_repairing');

-- AlterTable
ALTER TABLE "Item" 
  DROP COLUMN "status",
  ADD COLUMN "status" "ItemStatus" NOT NULL DEFAULT 'available';
