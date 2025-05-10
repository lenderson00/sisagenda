/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `OM` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OM" ADD COLUMN     "description" TEXT,
ADD COLUMN     "order" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OM_order_key" ON "OM"("order");
