// app/api/availability/simple/route.ts

import dayjs from "@/lib/dayjs";
import { NextResponse } from "next/server";

import type { AvailabilityExceptionRule } from "@/lib/engine/availability";
import { applyRulesToPossibleTimes } from "@/lib/engine/services/rules";
import {
  findFits,
  formatHHMM,
  splitByLunch,
  transformFitsToHH,
} from "@/lib/engine/time";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth/session/validate";
import { z } from "zod";

const schema = z.object({
  deliveryTypeId: z.string(),
  organizationId: z.string(),
  date: z.string(),
});

export async function GET(request: Request) {
  try {
    await validateSession();
    const { searchParams } = new URL(request.url);

    const { deliveryTypeId, organizationId, date } = schema.parse({
      deliveryTypeId: searchParams.get("deliveryTypeId"),
      organizationId: searchParams.get("organizationId"),
      date: searchParams.get("date"),
    });

    const referenceDate = dayjs(String(date));
    const isPastDate = referenceDate.endOf("day").isBefore(new Date());

    if (isPastDate) {
      return NextResponse.json({ possibleTimes: [], availableTimes: [] });
    }

    const parsed = dayjs(date, "DD-MM-YYYY", "pt-br");

    if (!parsed.isValid()) {
      return NextResponse.json(
        { message: "Formato de data inválido. Use 'dd-mm-yyyy'." },
        { status: 400 },
      );
    }

    const availabilityForDay = await prisma.availability.findFirst({
      where: {
        schedule: {
          deliveryTypes: {
            some: {
              id: deliveryTypeId,
            },
          },
        },
        weekDay: referenceDate.day(),
      },
      include: {
        schedule: {
          include: {
            deliveryTypes: {
              include: {
                AvailabilitySettings: true,
              },
            },
          },
        },
      },
    });

    if (!availabilityForDay) {
      return NextResponse.json({ possibleTimes: [], availableTimes: [] });
    }

    const orgRule = await prisma.availabilityRule.findUnique({
      where: { organizationId },
      include: {
        deliveryTypes: { select: { id: true } },
      },
    });

    let rules: AvailabilityExceptionRule[] = [];

    if (orgRule && Array.isArray(orgRule.rule)) {
      const deliveryTypeIds = orgRule.deliveryTypes.map((dt) => dt.id);
      if (
        deliveryTypeIds.length === 0 ||
        deliveryTypeIds.includes(deliveryTypeId)
      ) {
        rules = orgRule.rule as unknown as AvailabilityExceptionRule[];
      }
    }

    const lunchStart =
      availabilityForDay.schedule?.deliveryTypes[0]?.lunchTimeStart ?? 0;
    const lunchEnd =
      availabilityForDay.schedule?.deliveryTypes[0]?.lunchTimeEnd ?? 0;
    const activityDuration =
      availabilityForDay.schedule?.deliveryTypes[0]?.duration ?? 0;

    const startHour = availabilityForDay.startTime;
    const endHour = availabilityForDay.endTime;

    const blocks = splitByLunch(startHour, endHour, lunchStart, lunchEnd);
    const possibleTimesResult = transformFitsToHH(
      findFits(blocks, activityDuration),
    );

    // MAIN INTERNAL LOGIC
    const possibleTimes = possibleTimesResult.map((time) => formatHHMM(time));

    const timesAfterRules = applyRulesToPossibleTimes(
      possibleTimesResult,
      rules,
      referenceDate.toDate(),
    );

    const blockedTimes = await prisma.appointment.findMany({
      select: {
        date: true,
        duration: true,
      },
      where: {
        organizationId,
        date: {
          gte: referenceDate.startOf("day").toDate(),
          lte: referenceDate.endOf("day").toDate(),
        },
        status: {
          in: ["CONFIRMED", "PENDING_CONFIRMATION", "RESCHEDULE_CONFIRMED"],
        },
      },
    });

    const blockedIntervals = blockedTimes.map((bt) => {
      const start = dayjs(bt.date).hour() * 60 + dayjs(bt.date).minute();
      const end = start + bt.duration;
      return { start, end };
    });

    // MAIN LOGIC FOR AVAILABLE TIMES
    const availableTimes = timesAfterRules
      .filter((time) => {
        const newAppointmentStart = time;
        const newAppointmentEnd = time + activityDuration;

        // Check for overlap with any blocked interval
        return !blockedIntervals.some(
          (interval) =>
            newAppointmentStart < interval.end &&
            newAppointmentEnd > interval.start,
        );
      })
      .map((time) => formatHHMM(time));

    return NextResponse.json({ possibleTimes, availableTimes });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro interno ao buscar horários disponíveis." },
      { status: 500 },
    );
  }
}
