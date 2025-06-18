import type { Dayjs } from "dayjs";
import type { AvailabilityExceptionRule } from "./availability";
import type { TimeBlock } from "./time";

export function getBlockedIntervalsForDate(
  rule: AvailabilityExceptionRule,
  referenceDate: Dayjs,
): TimeBlock[] {
  if (rule.type !== "BLOCK_MULTI_DATE") {
    return [];
  }

  const referenceDateStr = referenceDate.format("YYYY-MM-DD");

  const blockedIntervals = rule.dates
    .filter((d) => d.date === referenceDateStr)
    .map((d) => ({ start: d.startTime, end: d.endTime }));

  return blockedIntervals;
}
