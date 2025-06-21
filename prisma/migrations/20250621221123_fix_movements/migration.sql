/*
  Warnings:

  - You are about to drop the column `duration` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `isVisible` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `lunchTimeEnd` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `lunchTimeStart` on the `Availability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "duration",
DROP COLUMN "isVisible",
DROP COLUMN "lunchTimeEnd",
DROP COLUMN "lunchTimeStart";

-- AlterTable
ALTER TABLE "DeliveryType" ADD COLUMN     "duration" SMALLINT NOT NULL DEFAULT 60,
ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lunchTimeEnd" SMALLINT NOT NULL DEFAULT 780,
ADD COLUMN     "lunchTimeStart" SMALLINT NOT NULL DEFAULT 720;
