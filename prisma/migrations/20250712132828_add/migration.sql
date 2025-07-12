-- DropForeignKey
ALTER TABLE "AppointmentActivity" DROP CONSTRAINT "AppointmentActivity_userId_fkey";

-- AlterTable
ALTER TABLE "AppointmentActivity" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AppointmentActivity" ADD CONSTRAINT "AppointmentActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
