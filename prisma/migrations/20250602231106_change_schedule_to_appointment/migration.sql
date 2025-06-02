/*
  Warnings:

  - The values [SCHEDULE] on the enum `AuditAction` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduleStatusHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CREATED', 'UPDATED', 'CANCELLED', 'COMPLETED', 'COMMENT', 'STATUS_CHANGE', 'ASSIGNED', 'UNASSIGNED', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "AuditAction_new" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APPOINTMENT', 'OTHER');
ALTER TABLE "AuditLog" ALTER COLUMN "action" TYPE "AuditAction_new" USING ("action"::text::"AuditAction_new");
ALTER TYPE "AuditAction" RENAME TO "AuditAction_old";
ALTER TYPE "AuditAction_new" RENAME TO "AuditAction";
DROP TYPE "AuditAction_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_deliveryTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_userId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleStatusHistory" DROP CONSTRAINT "ScheduleStatusHistory_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleStatusHistory" DROP CONSTRAINT "ScheduleStatusHistory_userId_fkey";

-- DropTable
DROP TABLE "Schedule";

-- DropTable
DROP TABLE "ScheduleStatusHistory";

-- DropEnum
DROP TYPE "ScheduleStatus";

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "deliveryTypeId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "observations" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentActivity" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "metadata" JSONB,
    "appointmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Appointment_userId_idx" ON "Appointment"("userId");

-- CreateIndex
CREATE INDEX "Appointment_organizationId_idx" ON "Appointment"("organizationId");

-- CreateIndex
CREATE INDEX "Appointment_deliveryTypeId_idx" ON "Appointment"("deliveryTypeId");

-- CreateIndex
CREATE INDEX "Appointment_date_idx" ON "Appointment"("date");

-- CreateIndex
CREATE INDEX "AppointmentActivity_appointmentId_idx" ON "AppointmentActivity"("appointmentId");

-- CreateIndex
CREATE INDEX "AppointmentActivity_userId_idx" ON "AppointmentActivity"("userId");

-- CreateIndex
CREATE INDEX "AppointmentActivity_createdAt_idx" ON "AppointmentActivity"("createdAt");

-- CreateIndex
CREATE INDEX "AppointmentActivity_type_idx" ON "AppointmentActivity"("type");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_deliveryTypeId_fkey" FOREIGN KEY ("deliveryTypeId") REFERENCES "DeliveryType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentActivity" ADD CONSTRAINT "AppointmentActivity_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentActivity" ADD CONSTRAINT "AppointmentActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
