/*
  Warnings:

  - You are about to drop the column `deliveryTypeId` on the `Availability` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_deliveryTypeId_fkey";

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "deliveryTypeId";

-- AlterTable
ALTER TABLE "DeliveryType" ADD COLUMN     "scheduleId" TEXT;

-- AddForeignKey
ALTER TABLE "DeliveryType" ADD CONSTRAINT "DeliveryType_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
