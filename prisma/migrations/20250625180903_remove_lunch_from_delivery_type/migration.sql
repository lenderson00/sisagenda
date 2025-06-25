/*
  Warnings:

  - You are about to drop the column `lunchTimeEnd` on the `DeliveryType` table. All the data in the column will be lost.
  - You are about to drop the column `lunchTimeStart` on the `DeliveryType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DeliveryType" DROP COLUMN "lunchTimeEnd",
DROP COLUMN "lunchTimeStart";
