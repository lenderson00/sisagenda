/*
  Warnings:

  - You are about to drop the column `availabilityId` on the `AvailabilityRule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[deliveryTypeId]` on the table `AvailabilityRule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lunchTimeEnd` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lunchTimeStart` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `startTime` on the `Availability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `Availability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `deliveryTypeId` to the `AvailabilityRule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AvailabilityRule" DROP CONSTRAINT "AvailabilityRule_availabilityId_fkey";

-- DropIndex
DROP INDEX "AvailabilityRule_availabilityId_idx";

-- DropIndex
DROP INDEX "AvailabilityRule_availabilityId_key";

-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "lunchTimeEnd" INTEGER NOT NULL,
ADD COLUMN     "lunchTimeStart" INTEGER NOT NULL,
DROP COLUMN "startTime",
ADD COLUMN     "startTime" INTEGER NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AvailabilityRule" DROP COLUMN "availabilityId",
ADD COLUMN     "deliveryTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accounts_organizationId_idx" ON "accounts"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "AvailabilityRule_deliveryTypeId_key" ON "AvailabilityRule"("deliveryTypeId");

-- CreateIndex
CREATE INDEX "AvailabilityRule_id_idx" ON "AvailabilityRule"("id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityRule" ADD CONSTRAINT "AvailabilityRule_deliveryTypeId_fkey" FOREIGN KEY ("deliveryTypeId") REFERENCES "DeliveryType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
