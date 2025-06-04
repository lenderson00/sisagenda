/*
  Warnings:

  - Added the required column `duration` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `startTime` on the `Availability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `Availability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "duration" SMALLINT NOT NULL,
DROP COLUMN "startTime",
ADD COLUMN     "startTime" INTEGER NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" INTEGER NOT NULL;
