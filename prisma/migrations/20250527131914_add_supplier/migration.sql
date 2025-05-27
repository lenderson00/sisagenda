/*
  Warnings:

  - You are about to drop the column `passwordReseted` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'FORNECEDOR';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordReseted";
