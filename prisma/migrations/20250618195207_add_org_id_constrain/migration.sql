/*
  Warnings:

  - A unique constraint covering the columns `[organizationId]` on the table `AvailabilityRule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AvailabilityRule_organizationId_key" ON "AvailabilityRule"("organizationId");
