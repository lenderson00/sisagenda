-- AlterEnum
ALTER TYPE "OMRole" ADD VALUE 'COMRJ';

-- CreateTable
CREATE TABLE "ScheduleStatusHistory" (
    "id" TEXT NOT NULL,
    "status" "ScheduleStatus" NOT NULL,
    "comment" TEXT,
    "scheduleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduleStatusHistory_scheduleId_idx" ON "ScheduleStatusHistory"("scheduleId");

-- CreateIndex
CREATE INDEX "ScheduleStatusHistory_userId_idx" ON "ScheduleStatusHistory"("userId");

-- CreateIndex
CREATE INDEX "ScheduleStatusHistory_createdAt_idx" ON "ScheduleStatusHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "ScheduleStatusHistory" ADD CONSTRAINT "ScheduleStatusHistory_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleStatusHistory" ADD CONSTRAINT "ScheduleStatusHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
