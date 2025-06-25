// app/api/availability/simple/route.ts

import dayjs from "@/lib/dayjs";
import { NextResponse } from "next/server";
import "dayjs/locale/pt-br";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@prisma/client";

/**
 * Calculates the minimum date considering antecedence days and available weekdays
 * @param minAntecedenceDays - Minimum number of days in advance required
 * @param availableWeekDays - Array of available weekdays (0-6, where 0 is Sunday)
 * @returns The earliest available date considering antecedence
 */
function calculateMinimumAvailableDate(
  minAntecedenceDays: number,
  availableWeekDays: number[],
): dayjs.Dayjs {
  const today = dayjs().startOf("day");
  let currentDate = today;
  let availableDaysCount = 0;

  // Count available days until we reach the minimum antecedence
  while (availableDaysCount < minAntecedenceDays) {
    currentDate = currentDate.add(1, "day");
    const weekDay = currentDate.day();

    if (availableWeekDays.includes(weekDay)) {
      availableDaysCount++;
    }
  }

  return currentDate;
}

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

    const schedule = await prisma.schedule.findFirst({
      where: {
        deliveryTypes: {
          some: { id: deliveryTypeId, deletedAt: null },
        },
      },
      include: {
        availability: true,
        deliveryTypes: true,
      },
    });

    if (!schedule) {
      return NextResponse.json(
        { message: "Horário não encontrado." },
        { status: 404 },
      );
    }

    const availability = schedule.availability;
    const deliveryType = schedule.deliveryTypes[0];

    const availableWeekDaysInMonth = availability.map((day) => day.weekDay);

    const yearMonth = dayjs(`${year}-${month}`);
    const daysInMonth = yearMonth.daysInMonth();
    const disabledDays: number[] = [];

    const minAntecedence = deliveryType.minAntecedence;

    const today = dayjs().startOf("day");

    console.log(minAntecedence);

    // Calculate minimum available date considering antecedence and available weekdays
    const minimumAvailableDate = calculateMinimumAvailableDate(
      minAntecedence,
      availableWeekDaysInMonth,
    );

    const limitDate =
      deliveryType.limitFutureBookings &&
      deliveryType.futureBookingLimitDays > 0
        ? today.add(deliveryType.futureBookingLimitDays, "day")
        : null;

    let dailyAppointmentCounts: Map<number, number> = new Map();

    if (deliveryType.limitPerDay) {
      const startOfMonth = yearMonth.startOf("month");
      const endOfMonth = yearMonth.endOf("month");

      const appointments = await prisma.appointment.findMany({
        where: {
          deliveryTypeId,
          organizationId,
          date: {
            gte: startOfMonth.toDate(),
            lte: endOfMonth.toDate(),
          },
          status: {
            in: [
              AppointmentStatus.PENDING_CONFIRMATION,
              AppointmentStatus.CONFIRMED,
              AppointmentStatus.CANCELLATION_REQUESTED,
              AppointmentStatus.RESCHEDULE_REQUESTED,
              AppointmentStatus.RESCHEDULE_CONFIRMED,
              AppointmentStatus.COMPLETED,
              AppointmentStatus.SUPPLIER_NO_SHOW,
            ],
          },
        },
        select: {
          date: true,
        },
      });

      dailyAppointmentCounts = appointments.reduce((acc, appointment) => {
        const day = dayjs(appointment.date).date();
        acc.set(day, (acc.get(day) || 0) + 1);
        return acc;
      }, new Map<number, number>());
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = yearMonth.date(day);
      const weekDay = currentDate.day();

      // Check if date is before minimum available date (considering antecedence)
      if (currentDate.isBefore(minimumAvailableDate, "day")) {
        disabledDays.push(day);
        continue;
      }

      if (limitDate && currentDate.isAfter(limitDate, "day")) {
        disabledDays.push(day);
        continue;
      }

      if (!availableWeekDaysInMonth.includes(weekDay)) {
        disabledDays.push(day);
        continue;
      }

      if (
        deliveryType.limitPerDay &&
        (dailyAppointmentCounts.get(day) || 0) >= deliveryType.maxBookingsPerDay
      ) {
        disabledDays.push(day);
      }
    }

    const dto = {
      disabledDays: [...new Set(disabledDays)].sort((a, b) => a - b),
      availableWeekDays: availableWeekDaysInMonth,
      minimumAntecedence: minAntecedence,
      minimumAvailableDate: minimumAvailableDate.format("YYYY-MM-DD"),
      today: today.format("YYYY-MM-DD"),
    };

    return NextResponse.json(dto);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro interno ao buscar horários disponíveis." },
      { status: 500 },
    );
  }
}
