// app/api/availability/simple/route.ts

import dayjs from "dayjs";
import { NextResponse } from "next/server";
import "dayjs/locale/pt-br";

import { auth } from "@/lib/auth";
import type { AvailabilityExceptionRule } from "@/lib/engine/availability";
import { applyRulesToPossibleTimes } from "@/lib/engine/services/rules";
import { getAvailableSlotsForDate } from "@/lib/engine/services/scheluing-with-rules";
import {
  findFits,
  formatHHMM,
  splitByLunch,
  transformFitsToHH,
} from "@/lib/engine/time";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const deliveryTypeId = searchParams.get("deliveryTypeId");
    const organizationId = searchParams.get("organizationId");
    const dateStr = searchParams.get("date"); // formato esperado "dd-mm-yyyy"

    if (!deliveryTypeId || !dateStr || !organizationId) {

      console.log(deliveryTypeId, dateStr, organizationId);


      return NextResponse.json(
        {
          message:
            "Parâmetros 'deliveryTypeId', 'date' e 'organizationId' são obrigatórios.",
        },
        { status: 400 },
      );
    }

    const referenceDate = dayjs(String(dateStr));
    const isPastDate = referenceDate.endOf("day").isBefore(new Date());

    if (isPastDate) {
      return NextResponse.json({ possibleTimes: [], availableTimes: [] });
    }

    // 1) Converte "dd-mm-yyyy" para Date usando dayjs e locale pt-br
    const parsed = dayjs(dateStr, "DD-MM-YYYY", "pt-br");


    if (!parsed.isValid()) {
      return NextResponse.json(
        { message: "Formato de data inválido. Use 'dd-mm-yyyy'." },
        { status: 400 },
      );
    }


    if (referenceDate.isBefore(new Date())) {
      return NextResponse.json({ possibleTimes: [], availableTimes: [] });
    }

    const availabilityForDay = await prisma.availability.findFirst({
      where: {
        deliveryTypeId,
        weekDay: referenceDate.day(),
      },
      include: {
        deliveryType: {
          include: {
            AvailabilitySettings: true,
            availabilityRules: true,
          },
        },
      },
    });

    if (!availabilityForDay) {
      return NextResponse.json({ possibleTimes: [], availableTimes: [] });
    }

    const lunchStart =
      availabilityForDay.deliveryType.AvailabilitySettings?.lunchTimeStart ?? 0;
    const lunchEnd =
      availabilityForDay.deliveryType.AvailabilitySettings?.lunchTimeEnd ?? 0;
    const activityDuration =
      availabilityForDay.deliveryType.AvailabilitySettings?.duration ?? 0;

    if (!lunchStart || !lunchEnd || !activityDuration) {
      return NextResponse.json(
        { message: "Lunch time or activity duration not found" },
        { status: 404 },
      );
    }

    const startHour = availabilityForDay.startTime;
    const endHour = availabilityForDay.endTime;

    const blocks = splitByLunch(startHour, endHour, lunchStart, lunchEnd);
    const possibleTimesResult = transformFitsToHH(
      findFits(blocks, activityDuration),
    );

    const possibleTimes = possibleTimesResult.map((time) => formatHHMM(time));

    const availabilityRule = availabilityForDay.deliveryType.availabilityRules;

    let rules: AvailabilityExceptionRule[] = [];

    if (availabilityRule && Array.isArray(availabilityRule.rule)) {
      rules = availabilityRule.rule as unknown as AvailabilityExceptionRule[];
    }

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

    const newActivityDuration = activityDuration; // duration of appointment to be scheduled

    const blockedIntervals = blockedTimes.map((bt) => {
      const start = dayjs(bt.date).hour() * 60 + dayjs(bt.date).minute();
      const end = start + bt.duration;
      return { start, end };
    });

    const availableTimes = timesAfterRules
      .filter((time) => {
        const newAppointmentStart = time;
        const newAppointmentEnd = time + newActivityDuration;

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
