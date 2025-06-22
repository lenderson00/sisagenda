-- AlterTable
ALTER TABLE "DeliveryType" ADD COLUMN     "limitPerDay" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxBookingsPerDay" INTEGER NOT NULL DEFAULT 10;
