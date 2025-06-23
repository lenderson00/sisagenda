/*
  Warnings:

  - You are about to drop the `AvailabilitySettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AvailabilitySettings" DROP CONSTRAINT "AvailabilitySettings_deliveryTypeId_fkey";

-- DropTable
DROP TABLE "AvailabilitySettings";
