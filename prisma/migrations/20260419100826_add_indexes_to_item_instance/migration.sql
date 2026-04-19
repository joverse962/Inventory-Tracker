-- CreateIndex
CREATE INDEX "ItemInstance_availability_idx" ON "ItemInstance"("availability");

-- CreateIndex
CREATE INDEX "ItemInstance_takenAt_idx" ON "ItemInstance"("takenAt");

-- CreateIndex
CREATE INDEX "ItemInstance_borrowedAt_idx" ON "ItemInstance"("borrowedAt");
