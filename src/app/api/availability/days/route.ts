// app/api/availability/simple/route.ts

import dayjs from "dayjs";
import { NextResponse } from "next/server";
import "dayjs/locale/pt-br";

import { auth } from "@/lib/auth";
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
    const year = searchParams.get("year"); // formato esperado "dd-mm-yyyy"
    const month = searchParams.get("month");

    if (!deliveryTypeId || !year || !month || !organizationId) {
      return NextResponse.json(
        {
          message:
            "Parâmetros 'deliveryTypeId', 'date' e 'organizationId' são obrigatórios.",
        },
        { status: 400 },
      );
    }

    const availableWeekDays = await prisma.availability.findMany({
      where: {
        deliveryTypeId,
        organizationId,
      },
      select: {
        weekDay: true,
      },
    })

    const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
      return !availableWeekDays.some(
        (availableWeekDay) => availableWeekDay.weekDay === weekDay,
      );
    });

    const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    WITH daily_slots AS (
      SELECT
        EXTRACT(DAY FROM S.date) AS date,
        COUNT(S.id) AS scheduled_count,
        SUM(S.duration) AS total_scheduled_minutes
      FROM "Appointment" S
      WHERE S.organizationId = ${organizationId}
        AND S.deliveryTypeId = ${deliveryTypeId}
        AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}
        AND S.deletedAt IS NULL
      GROUP BY EXTRACT(DAY FROM S.date)
    ),
    daily_availability AS (
      SELECT
        A.weekDay,
        SUM(
          CASE
            WHEN A.startTime[i] < (SELECT "lunchTimeStart" FROM "AvailabilitySettings" WHERE "deliveryTypeId" = ${deliveryTypeId})
              AND A.endTime[i] > (SELECT "lunchTimeEnd" FROM "AvailabilitySettings" WHERE "deliveryTypeId" = ${deliveryTypeId})
            THEN
              ((SELECT "lunchTimeStart" FROM "AvailabilitySettings" WHERE "deliveryTypeId" = ${deliveryTypeId}) - A.startTime[i] +
               A.endTime[i] - (SELECT "lunchTimeEnd" FROM "AvailabilitySettings" WHERE "deliveryTypeId" = ${deliveryTypeId}))
            WHEN A.startTime[i] < (SELECT "lunchTimeStart" FROM "AvailabilitySettings" WHERE "deliveryTypeId" = ${deliveryTypeId})
              AND A.endTime[i] <= (SELECT "lunchTimeEnd" FROM "AvailabilitySettings" WHERE "deliveryTypeId" = ${deliveryTypeId})
            THEN
              ((SELECT "lunchTimeStart" FROM "AvailabilitySettings" WHERE "deliveryTypeId" = ${deliveryTypeId}) - A.startTime[i])
            WHEN A.startTime[i] >= (SELECT "lunchTimeStart" FROM "AvailabilitySettings" WHERE "deliveryTypeId" = ${deliveryTypeId})
              AND A.endTime[i] > (SELECT "lunchTimeEnd" FROM "AvailabilitySettings" WHERE "deliveryTypeId" = ${deliveryTypeId})
            THEN
              (A.endTime[i] - (SELECT "lunchTimeEnd" FROM "AvailabilitySettings" WHERE "deliveryTypeId" = ${deliveryTypeId}))
            ELSE
              (A.endTime[i] - A.startTime[i])
          END /
          (SELECT duration FROM "AvailabilitySettings" WHERE "deliveryTypeId" = ${deliveryTypeId})
        ) AS available_slots
      FROM "Availability" A
      CROSS JOIN LATERAL generate_series(1, array_length(A.startTime, 1)) AS i
      WHERE A.organizationId = ${organizationId}
        AND A.deliveryTypeId = ${deliveryTypeId}
        AND A.deletedAt IS NULL
      GROUP BY A.weekDay
    )
    SELECT
      ds.date
    FROM daily_slots ds
    JOIN daily_availability da ON da.weekDay = WEEKDAY(DATE_ADD(STR_TO_DATE(${`${year}-${month}-01`}, '%Y-%m-%d'), INTERVAL ds.date - 1 DAY))
    WHERE ds.scheduled_count >= da.available_slots
  `
    const blockedDates = blockedDatesRaw.map((item) => item.date)

    console.log(blockedDates, "blockedDates");

    // 5) Retorna { times: ["08:00", "09:00", …] }
    return NextResponse.json({ blockedWeekDays, blockedDates });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro interno ao buscar horários disponíveis." },
      { status: 500 },
    );
  }
}
