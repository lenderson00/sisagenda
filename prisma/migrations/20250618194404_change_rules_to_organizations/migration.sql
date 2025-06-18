/*
  Warnings:

  - You are about to drop the column `deliveryTypeId` on the `AvailabilityRule` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `AvailabilityRule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AvailabilityRule" DROP CONSTRAINT "AvailabilityRule_deliveryTypeId_fkey";

-- DropIndex
DROP INDEX "AvailabilityRule_deliveryTypeId_key";

-- AlterTable
ALTER TABLE "AvailabilityRule" DROP COLUMN "deliveryTypeId",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DeliveryType" ADD COLUMN     "availabilityRuleId" TEXT;

-- AddForeignKey
ALTER TABLE "DeliveryType" ADD CONSTRAINT "DeliveryType_availabilityRuleId_fkey" FOREIGN KEY ("availabilityRuleId") REFERENCES "AvailabilityRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityRule" ADD CONSTRAINT "AvailabilityRule_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
