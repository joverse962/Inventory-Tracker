-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "borrowedReminderSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "takenAt" TIMESTAMP(3),
ADD COLUMN     "takenById" TEXT,
ADD COLUMN     "takenReminderSent" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_takenById_fkey" FOREIGN KEY ("takenById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
