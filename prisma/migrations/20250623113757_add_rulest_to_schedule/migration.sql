/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `AvailabilityRule` table. All the data in the column will be lost.
  - You are about to drop the column `availabilityRuleId` on the `DeliveryType` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "AvailabilityRule" DROP CONSTRAINT "AvailabilityRule_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "DeliveryType" DROP CONSTRAINT "DeliveryType_availabilityRuleId_fkey";

-- DropIndex
DROP INDEX "Availability_organizationId_idx";

-- DropIndex
DROP INDEX "AvailabilityRule_organizationId_key";

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "AvailabilityRule" DROP COLUMN "organizationId",
ADD COLUMN     "scheduleId" TEXT;

-- AlterTable
ALTER TABLE "DeliveryType" DROP COLUMN "availabilityRuleId";

-- AddForeignKey
ALTER TABLE "AvailabilityRule" ADD CONSTRAINT "AvailabilityRule_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
