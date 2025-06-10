// app/api/availability/simple/route.ts

import dayjs from "dayjs";
import { NextResponse } from "next/server";
import "dayjs/locale/pt-br";

import { auth } from "@/lib/auth";
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
    });

    const availableWeekDaysInMonth = availableWeekDays.map(
      (day) => day.weekDay,
    );

    const yearMonth = dayjs(`${year}-${month}`);
    const daysInMonth = yearMonth.daysInMonth();
    const disabledDays: number[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = yearMonth.date(day);
      const weekDay = currentDate.day();
      if (!availableWeekDaysInMonth.includes(weekDay)) {
        disabledDays.push(day);
      }
    }

    // 5) Retorna { times: ["08:00", "09:00", …] }
    return NextResponse.json({
      disabledDays: disabledDays,
      availableWeekDays: availableWeekDaysInMonth,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro interno ao buscar horários disponíveis." },
      { status: 500 },
    );
  }
}
