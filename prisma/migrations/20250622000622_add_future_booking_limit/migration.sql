-- AlterTable
ALTER TABLE "DeliveryType" ADD COLUMN     "futureBookingLimitDays" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "limitFutureBookings" BOOLEAN NOT NULL DEFAULT false;
