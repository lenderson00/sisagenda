/*
  Warnings:

  - The values [CSUP,COMRJ] on the enum `OMRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isDeleted` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OMRole_new" AS ENUM ('COMIMSUP', 'DEPOSITO');
ALTER TABLE "Organization" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Organization" ALTER COLUMN "role" TYPE "OMRole_new" USING ("role"::text::"OMRole_new");
ALTER TYPE "OMRole" RENAME TO "OMRole_old";
ALTER TYPE "OMRole_new" RENAME TO "OMRole";
DROP TYPE "OMRole_old";
ALTER TABLE "Organization" ALTER COLUMN "role" SET DEFAULT 'DEPOSITO';
COMMIT;

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "comimsupId" TEXT;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "isDeleted",
ALTER COLUMN "observations" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordReseted" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Account";

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_comimsupId_fkey" FOREIGN KEY ("comimsupId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
