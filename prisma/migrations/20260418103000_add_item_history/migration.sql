-- CreateEnum
CREATE TYPE "ItemHistoryAction" AS ENUM ('borrow', 'take', 'return');

-- CreateTable
CREATE TABLE "ItemHistory" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "ItemHistoryAction" NOT NULL,
    "availabilitySnapshot" "Availability",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ItemHistory_userId_createdAt_idx" ON "ItemHistory"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ItemHistory_itemId_createdAt_idx" ON "ItemHistory"("itemId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "ItemHistory" ADD CONSTRAINT "ItemHistory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemHistory" ADD CONSTRAINT "ItemHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
