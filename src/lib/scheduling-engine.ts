import {
  Prisma,
  // AvailabilityRule as PrismaRule, // Assuming its 'rule' field contains an array of logical rules.
  Appointment as PrismaAppointment,
  Availability as PrismaAvailability,
  DeliveryType as PrismaDeliveryType,
  Organization as PrismaOrganization,
} from "@prisma/client";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { RRule, RRuleSet, rrulestr } from "rrule";
import { prisma } from "./prisma";

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const ORGANIZATION_TIMEZONE = "America/Sao_Paulo";

// --- Type Definitions for Rules and Slots ---

export interface TimeSlot {
  start: Date; // UTC Date object
  end: Date; // UTC Date object
}

// Structure for a logical rule (to be stored in an array within AvailabilityRule.rule JSON field)
interface RuleConditionDate {
  type: "date";
  date: string; // YYYY-MM-DD (interpreted in organization's timezone)
}

interface RuleConditionDateRange {
  type: "dateRange";
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

interface RuleConditionRRule {
  type: "rrule";
  rruleString: string; // iCalendar RRULE string
}

type RuleCondition =
  | RuleConditionDate
  | RuleConditionDateRange
  | RuleConditionRRule;

interface ActionSetUnavailable {
  type: "setUnavailable";
}

interface TimeOfDay {
  // Represents time, e.g., "09:00"
  hours: number;
  minutes: number;
}

interface AvailabilityPeriod {
  // A continuous block of time, e.g., 9am to 5pm
  startTime: TimeOfDay; // e.g., { hours: 9, minutes: 0 }
  endTime: TimeOfDay; // e.g., { hours: 17, minutes: 0 }
}

interface ActionSetCustomSlots {
  type: "setCustomSlots";
  periods: AvailabilityPeriod[]; // Defines new availability periods for the day
  duration?: number; // Optional: overrides base duration for these slots (in minutes)
}

type RuleAction = ActionSetUnavailable | ActionSetCustomSlots;

export interface SchedulingRule {
  id: string; // Unique ID for the rule, e.g., cuid()
  description?: string;
  priority: number; // Higher priority rules are processed first (e.g., 100 > 10)
  isActive: boolean;
  condition: RuleCondition;
  action: RuleAction;
}

// --- Helper Functions ---

function minutesToTimeOfDay(minutes: number): TimeOfDay {
  return {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60,
  };
}

function generateSlotsForPeriod(
  dateObj: dayjs.Dayjs, // Date object for the target day, in org timezone
  period: AvailabilityPeriod,
  durationMinutes: number,
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let currentSlotStart = dateObj
    .hour(period.startTime.hours)
    .minute(period.startTime.minutes)
    .second(0)
    .millisecond(0);
  const periodEnd = dateObj
    .hour(period.endTime.hours)
    .minute(period.endTime.minutes)
    .second(0)
    .millisecond(0);

  while (currentSlotStart.add(durationMinutes, "minutes").isBefore(periodEnd)) {
    const slotEnd = currentSlotStart.add(durationMinutes, "minutes");
    slots.push({
      start: currentSlotStart.toDate(), // Convert to UTC Date
      end: slotEnd.toDate(), // Convert to UTC Date
    });
    currentSlotStart = slotEnd;
  }
  return slots;
}

// --- Main Engine Logic ---

interface GetAvailabilityParams {
  deliveryTypeId: string;
  date: string; // YYYY-MM-DD
}

export interface DailyAvailability {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
  isUnavailableDueToRule?: boolean; // Flag if a rule made the entire day unavailable
}

export async function getCalculatedAvailability(
  params: GetAvailabilityParams,
): Promise<DailyAvailability> {
  const { deliveryTypeId, date } = params;

  const deliveryType = await prisma.deliveryType.findUnique({
    where: { id: deliveryTypeId },
    include: {
      organization: true,
      availability: true,
      availabilityRules: true,
      AvailabilitySettings: true,
    },
  });

  const availabilityRules = deliveryType?.availabilityRules?.rule as unknown as SchedulingRule[] || []

  if (!deliveryType) {
    throw new Error(`DeliveryType with id ${deliveryTypeId} not found.`);
  }

  if (!deliveryType.availability) {
    console.warn(
      `No base availability found for DeliveryType ${deliveryTypeId}.`,
    );
    return {
      date,
      slots: [],
      isUnavailableDueToRule: false,
    };
  }

  const rules: SchedulingRule[] = availabilityRules.filter(
    (rule) => typeof rule === "object" && rule !== null,
  );
  rules.sort((a, b) => b.priority - a.priority);

  const targetDate = dayjs(date).tz(ORGANIZATION_TIMEZONE, true);
  const startOfDay = targetDate.startOf("day");
  const endOfDay = targetDate.endOf("day");

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      deliveryTypeId: deliveryTypeId,
      date: {
        gte: startOfDay.toDate(),
        lte: endOfDay.toDate(),
      },
      deletedAt: null,
    },
    select: {
      date: true,
    },
  });

  const duration = deliveryType.AvailabilitySettings?.duration;
  const availability = deliveryType.availability[0];

  if (!duration || !availability) {
    throw new Error(`Duration or availability not found for DeliveryType ${deliveryTypeId}.`);
  }

  const baseDurationMinutes = duration;

  let calculatedSlotsForDay: TimeSlot[] = [];
  let dayMarkedUnavailableByRule = false;
  let currentDuration = baseDurationMinutes;

  // Check if the day matches the base availability weekday
  if (availability.weekDay === targetDate.day()) {
    for (let i = 0; i < availability.startTime; i++) {
      const period: AvailabilityPeriod = {
        startTime: minutesToTimeOfDay(availability.startTime),
        endTime: minutesToTimeOfDay(availability.endTime),
      };
      calculatedSlotsForDay.push(
        ...generateSlotsForPeriod(targetDate, period, baseDurationMinutes),
      );
    }
  }

  // Apply rules
  for (const rule of rules.filter((r) => r.isActive)) {
    let ruleApplies = false;
    const ruleCondition = rule.condition;

    if (ruleCondition.type === "date") {
      if (
        dayjs(ruleCondition.date)
          .tz(ORGANIZATION_TIMEZONE, true)
          .isSame(targetDate, "day")
      ) {
        ruleApplies = true;
      }
    } else if (ruleCondition.type === "dateRange") {
      const ruleStart = dayjs(ruleCondition.startDate).tz(
        ORGANIZATION_TIMEZONE,
        true,
      );
      const ruleEnd = dayjs(ruleCondition.endDate).tz(
        ORGANIZATION_TIMEZONE,
        true,
      );
      if (
        targetDate.isSameOrAfter(ruleStart, "day") &&
        targetDate.isSameOrBefore(ruleEnd, "day")
      ) {
        ruleApplies = true;
      }
    } else if (ruleCondition.type === "rrule") {
      try {
        const rruleObj = rrulestr(ruleCondition.rruleString, {
          dtstart: startOfDay.toDate(),
        });
        const occurrences = rruleObj.between(
          startOfDay.toDate(),
          endOfDay.toDate(),
          true, // inc = true
        );
        if (occurrences.length > 0) {
          ruleApplies = true;
        }
      } catch (e) {
        console.error(
          `Error parsing rrule string for rule ${rule.id}: ${ruleCondition.rruleString}`,
          e,
        );
      }
    }

    if (ruleApplies) {
      if (rule.action.type === "setUnavailable") {
        calculatedSlotsForDay = [];
        dayMarkedUnavailableByRule = true;
        break;
      }
      if (rule.action.type === "setCustomSlots") {
        calculatedSlotsForDay = [];
        currentDuration = rule.action.duration ?? baseDurationMinutes;
        for (const period of rule.action.periods) {
          calculatedSlotsForDay.push(
            ...generateSlotsForPeriod(targetDate, period, currentDuration),
          );
        }
      }
    }
  }

  // Remove booked slots
  if (!dayMarkedUnavailableByRule) {
    const bookedStartsForDay = existingAppointments
      .map((appt) => dayjs(appt.date).tz(ORGANIZATION_TIMEZONE))
      .filter((apptStart) => apptStart.isSame(targetDate, "day"))
      .map((apptStart) => apptStart.valueOf());

    calculatedSlotsForDay = calculatedSlotsForDay.filter((slot) => {
      const slotStartMs = dayjs(slot.start).valueOf();
      return !bookedStartsForDay.includes(slotStartMs);
    });
  }

  // Remove past slots for current day
  if (targetDate.isSame(dayjs().tz(ORGANIZATION_TIMEZONE), "day")) {
    const nowInOrgTz = dayjs().tz(ORGANIZATION_TIMEZONE);
    calculatedSlotsForDay = calculatedSlotsForDay.filter((slot) =>
      dayjs(slot.start).isAfter(nowInOrgTz),
    );
  }

  return {
    date: targetDate.format("YYYY-MM-DD"),
    slots: calculatedSlotsForDay,
    isUnavailableDueToRule: dayMarkedUnavailableByRule,
  };
}
