/*
  Warnings:

  - A unique constraint covering the columns `[internalId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `internalId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'COMIMSUP_ADMIN';
ALTER TYPE "UserRole" ADD VALUE 'COMRJ_ADMIN';

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "internalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_internalId_key" ON "Appointment"("internalId");

-- CreateIndex
CREATE INDEX "Appointment_internalId_idx" ON "Appointment"("internalId");
