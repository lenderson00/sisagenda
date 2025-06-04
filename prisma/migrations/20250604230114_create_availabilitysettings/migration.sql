/*
  Warnings:

  - You are about to drop the column `lunchTimeEnd` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `lunchTimeStart` on the `Availability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "lunchTimeEnd",
DROP COLUMN "lunchTimeStart";

-- CreateTable
CREATE TABLE "AvailabilitySettings" (
    "id" TEXT NOT NULL,
    "lunchTimeStart" INTEGER NOT NULL,
    "lunchTimeEnd" INTEGER NOT NULL,
    "deliveryTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilitySettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvailabilitySettings_deliveryTypeId_key" ON "AvailabilitySettings"("deliveryTypeId");

-- AddForeignKey
ALTER TABLE "AvailabilitySettings" ADD CONSTRAINT "AvailabilitySettings_deliveryTypeId_fkey" FOREIGN KEY ("deliveryTypeId") REFERENCES "DeliveryType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
