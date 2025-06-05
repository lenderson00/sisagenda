// app/api/availability/simple/route.ts

import dayjs from "dayjs";
import { NextResponse } from "next/server";
import "dayjs/locale/pt-br";

import { auth } from "@/lib/auth";
import { getAvailableSlotsForDate } from "@/lib/engine/services/scheluing-with-rules";
import { findFits, formatHHMM, splitByLunch, transformFitsToHH } from "@/lib/engine/time";
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
      return NextResponse.json(
        { message: "Parâmetros 'deliveryTypeId', 'date' e 'organizationId' são obrigatórios." },
        { status: 400 }
      );
    }

    const referenceDate = dayjs(String(dateStr))
    const isPastDate = referenceDate.endOf('day').isBefore(new Date())

    if (isPastDate) {
      return NextResponse.json({ possibleTimes: [], availableTimes: [] })
    }


    // 1) Converte “dd-mm-yyyy” para Date usando dayjs e locale pt-br
    const parsed = dayjs(dateStr, "DD-MM-YYYY", "pt-br");

    if (!parsed.isValid()) {
      return NextResponse.json(
        { message: "Formato de data inválido. Use 'dd-mm-yyyy'." },
        { status: 400 }
      );
    }
    const date = parsed.toDate();

    if (referenceDate.isBefore(new Date())) {
      return NextResponse.json({ possibleTimes: [], availableTimes: [] })
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
      return NextResponse.json({ possibleTimes: [], availableTimes: [] })
    }

    const lunchStart = availabilityForDay.deliveryType.AvailabilitySettings?.lunchTimeStart ?? 0
    const lunchEnd = availabilityForDay.deliveryType.AvailabilitySettings?.lunchTimeEnd ?? 0
    const activityDuration = availabilityForDay.deliveryType.AvailabilitySettings?.duration ?? 0

    if (!lunchStart || !lunchEnd || !activityDuration) {
      return NextResponse.json(
        { message: "Lunch time or activity duration not found" },
        { status: 404 }
      );
    }

    const startHour = availabilityForDay.startTime
    const endHour = availabilityForDay.endTime

    const blocks = splitByLunch(startHour, endHour, lunchStart, lunchEnd)
    const possibleTimesResult = transformFitsToHH(findFits(blocks, activityDuration))

    const possibleTimes = possibleTimesResult.map((time) => formatHHMM(time))

    const availabilityRule = availabilityForDay.deliveryType.availabilityRules[0]

    let rule: any[] = []

    if (availabilityRule) {
      rule = availabilityRule.rule as any[]
    }

    console.log(rule, "rule")


    const blockedTimes = await prisma.appointment.findMany({
      select: {
        date: true,
      },
      where: {
        organizationId,
        date: {
          gte: referenceDate.set('hour', startHour / 60).toDate(),
          lte: referenceDate.set('hour', endHour / 60).toDate(),
        },
      },
    })

    console.log(blockedTimes, "blockedTimes")

    const availableTimes = possibleTimesResult.filter((time) => {
      const isTimeBlocked = blockedTimes.some(
        (blockedTime) => blockedTime.date.getHours() === time / 60,
      )
      return !isTimeBlocked
    })

    console.log(availableTimes, "availableTimes")
    // 5) Retorna { times: ["08:00", "09:00", …] }
    return NextResponse.json({ possibleTimes, availableTimes });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro interno ao buscar horários disponíveis." },
      { status: 500 }
    );
  }
}
