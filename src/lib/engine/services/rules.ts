import type { AvailabilityExceptionRule } from "../availability";
import { getBlockedIntervalsForDate } from "../rule";

/**
 * Applies a list of availability rules to a list of possible time slots.
 *
 * @param possibleTimes - An array of time slots in minutes from midnight.
 * @param rules - An array of availability exception rules.
 * @param referenceDate - The date for which to check the rules.
 * @returns A new array of time slots with the blocked times removed.
 */
export function applyRulesToPossibleTimes(
  possibleTimes: number[],
  rules: AvailabilityExceptionRule[],
  referenceDate: Date,
): number[] {
  if (!rules || rules.length === 0) {
    return possibleTimes;
  }

  const allBlockedIntervals = rules.flatMap((rule) =>
    getBlockedIntervalsForDate(rule, referenceDate),
  );

  if (allBlockedIntervals.length === 0) {
    return possibleTimes;
  }

  return possibleTimes.filter((time) => {
    return !allBlockedIntervals.some(
      (interval) => time >= interval.start && time < interval.end,
    );
  });
}
