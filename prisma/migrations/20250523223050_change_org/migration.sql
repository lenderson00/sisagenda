/*
  Warnings:

  - You are about to drop the column `order` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Organization` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Organization_order_key";

-- DropIndex
DROP INDEX "Organization_slug_key";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "order",
DROP COLUMN "slug";
