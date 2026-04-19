-- Create new enums
CREATE TYPE "Availability" AS ENUM ('available', 'borrowed', 'taken');
CREATE TYPE "ItemCondition" AS ENUM ('good', 'waste', 'need_repairing');

-- Add new columns with defaults
ALTER TABLE "Item" ADD COLUMN "availability" "Availability" NOT NULL DEFAULT 'available';
ALTER TABLE "Item" ADD COLUMN "new_status" "ItemCondition" NOT NULL DEFAULT 'good';

-- Drop the old status column
ALTER TABLE "Item" DROP COLUMN "status";

-- Rename new_status to status
ALTER TABLE "Item" RENAME COLUMN "new_status" TO "status";

-- Drop the old enum
DROP TYPE IF EXISTS "ItemStatus";
