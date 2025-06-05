/*
  Warnings:

  - You are about to alter the column `lunchTimeStart` on the `AvailabilitySettings` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `lunchTimeEnd` on the `AvailabilitySettings` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.

*/
-- AlterTable
ALTER TABLE "AvailabilitySettings" ALTER COLUMN "lunchTimeStart" SET DEFAULT 720,
ALTER COLUMN "lunchTimeStart" SET DATA TYPE SMALLINT,
ALTER COLUMN "lunchTimeEnd" SET DEFAULT 780,
ALTER COLUMN "lunchTimeEnd" SET DATA TYPE SMALLINT,
ALTER COLUMN "duration" SET DEFAULT 60;
