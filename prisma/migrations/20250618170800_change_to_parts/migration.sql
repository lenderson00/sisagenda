/*
  Warnings:

  - The values [ASSIGNED,UNASSIGNED] on the enum `ActivityType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `toolInvocations` on the `Message` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityType_new" AS ENUM ('CREATED', 'UPDATED', 'CANCELLED', 'COMPLETED', 'COMMENT', 'STATUS_CHANGE', 'RESCHEDULE_REQUESTED', 'RESCHEDULE_CONFIRMED', 'RESCHEDULE_REJECTED', 'SUPPLIER_NO_SHOW', 'DELIVERY_CONFIRMED', 'DELIVERY_REJECTED', 'OTHER');
ALTER TABLE "AppointmentActivity" ALTER COLUMN "type" TYPE "ActivityType_new" USING ("type"::text::"ActivityType_new");
ALTER TYPE "ActivityType" RENAME TO "ActivityType_old";
ALTER TYPE "ActivityType_new" RENAME TO "ActivityType";
DROP TYPE "ActivityType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "toolInvocations",
ADD COLUMN     "parts" JSONB;
