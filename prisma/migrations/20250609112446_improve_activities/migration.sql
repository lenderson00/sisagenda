-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActivityType" ADD VALUE 'RESCHEDULE_REQUESTED';
ALTER TYPE "ActivityType" ADD VALUE 'RESCHEDULE_CONFIRMED';
ALTER TYPE "ActivityType" ADD VALUE 'RESCHEDULE_REJECTED';
ALTER TYPE "ActivityType" ADD VALUE 'SUPPLIER_NO_SHOW';
ALTER TYPE "ActivityType" ADD VALUE 'DELIVERY_CONFIRMED';
ALTER TYPE "ActivityType" ADD VALUE 'DELIVERY_REJECTED';

-- AlterTable
ALTER TABLE "AppointmentActivity" ADD COLUMN     "isInternal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "newStatus" "AppointmentStatus",
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "previousStatus" "AppointmentStatus",
ADD COLUMN     "priority" INTEGER DEFAULT 0;

-- CreateIndex
CREATE INDEX "AppointmentActivity_isInternal_idx" ON "AppointmentActivity"("isInternal");

-- CreateIndex
CREATE INDEX "AppointmentActivity_isVisible_idx" ON "AppointmentActivity"("isVisible");

-- CreateIndex
CREATE INDEX "AppointmentActivity_parentId_idx" ON "AppointmentActivity"("parentId");

-- AddForeignKey
ALTER TABLE "AppointmentActivity" ADD CONSTRAINT "AppointmentActivity_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "AppointmentActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
