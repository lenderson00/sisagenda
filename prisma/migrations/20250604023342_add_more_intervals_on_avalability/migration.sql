/*
  Warnings:

  - The `startTime` column on the `Availability` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `endTime` column on the `Availability` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "startTime",
ADD COLUMN     "startTime" INTEGER[],
DROP COLUMN "endTime",
ADD COLUMN     "endTime" INTEGER[];
