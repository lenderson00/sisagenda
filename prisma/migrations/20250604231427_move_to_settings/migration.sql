/*
  Warnings:

  - You are about to drop the column `duration` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Availability` table. All the data in the column will be lost.
  - Added the required column `duration` to the `AvailabilitySettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "duration",
DROP COLUMN "isActive";

-- AlterTable
ALTER TABLE "AvailabilitySettings" ADD COLUMN     "duration" SMALLINT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
