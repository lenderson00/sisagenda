/*
  Warnings:

  - You are about to drop the column `rule` on the `AvailabilityRule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AvailabilityRule" DROP COLUMN "rule",
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "endTime" INTEGER,
ADD COLUMN     "isAllDay" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startTime" INTEGER;
