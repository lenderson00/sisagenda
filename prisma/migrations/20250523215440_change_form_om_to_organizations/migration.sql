/*
  Warnings:

  - You are about to drop the column `omId` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `omId` on the `DeliveryType` table. All the data in the column will be lost.
  - You are about to drop the column `omId` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `oMId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `OM` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `organizationId` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `DeliveryType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_omId_fkey";

-- DropForeignKey
ALTER TABLE "DeliveryType" DROP CONSTRAINT "DeliveryType_omId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_omId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_oMId_fkey";

-- DropIndex
DROP INDEX "Availability_omId_idx";

-- DropIndex
DROP INDEX "DeliveryType_omId_idx";

-- DropIndex
DROP INDEX "Schedule_omId_idx";

-- DropIndex
DROP INDEX "User_oMId_idx";

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "omId",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DeliveryType" DROP COLUMN "omId",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "omId",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "oMId",
ADD COLUMN     "organizationId" TEXT;

-- DropTable
DROP TABLE "OM";

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" SERIAL NOT NULL,
    "role" "OMRole" NOT NULL DEFAULT 'DEPOSITO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_sigla_key" ON "Organization"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_order_key" ON "Organization"("order");

-- CreateIndex
CREATE INDEX "Organization_sigla_idx" ON "Organization"("sigla");

-- CreateIndex
CREATE INDEX "Availability_organizationId_idx" ON "Availability"("organizationId");

-- CreateIndex
CREATE INDEX "DeliveryType_organizationId_idx" ON "DeliveryType"("organizationId");

-- CreateIndex
CREATE INDEX "Schedule_organizationId_idx" ON "Schedule"("organizationId");

-- CreateIndex
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryType" ADD CONSTRAINT "DeliveryType_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
