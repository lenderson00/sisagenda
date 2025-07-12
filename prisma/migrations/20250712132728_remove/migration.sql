-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropIndex
DROP INDEX "Appointment_userId_idx";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Appointment_supplierId_idx" ON "Appointment"("supplierId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
