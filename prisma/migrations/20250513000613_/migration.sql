/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `DeliveryType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `OM` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `DeliveryType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `OM` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeliveryType" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OM" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryType_slug_key" ON "DeliveryType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "OM_slug_key" ON "OM"("slug");
