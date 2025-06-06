/*
  Warnings:

  - A unique constraint covering the columns `[ordemDeCompra]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ordemDeCompra` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING_CONFIRMATION', 'CONFIRMED', 'REJECTED', 'CANCELLATION_REQUESTED', 'CANCELLATION_REJECTED', 'CANCELLED', 'RESCHEDULE_REQUESTED', 'RESCHEDULE_CONFIRMED', 'RESCHEDULE_REJECTED', 'RESCHEDULED', 'COMPLETED', 'SUPPLIER_NO_SHOW');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "ordemDeCompra" TEXT NOT NULL,
ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING_CONFIRMATION';

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_ordemDeCompra_key" ON "Appointment"("ordemDeCompra");
