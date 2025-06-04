// app/api/availability/simple/route.ts

import dayjs from "dayjs";
import { NextResponse } from "next/server";
import "dayjs/locale/pt-br";

import { auth } from "@/lib/auth";
import { getAvailableSlotsForDate } from "@/lib/engine/services/scheluing-with-rules";
import { formatHHMM } from "@/lib/engine/time";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const deliveryTypeId = searchParams.get("deliveryTypeId");
    const dateStr = searchParams.get("date"); // formato esperado "dd-mm-yyyy"

    if (!deliveryTypeId || !dateStr) {
      return NextResponse.json(
        { message: "Parâmetros 'deliveryTypeId' e 'date' são obrigatórios." },
        { status: 400 }
      );
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

    const deliveryType = await prisma.deliveryType.findFirst({
      where: {
        id: deliveryTypeId,
      },
      include: {
        AvailabilityRule: true,
        AvailabilitySettings: true,
      },
    });

    if (!deliveryType) {
      return NextResponse.json(
        { message: "Delivery type not found" },
        { status: 404 }
      );
    }

    // 2) Parâmetros fixos (ou parametrizáveis se quiser):
    const lunchStart = deliveryType.AvailabilitySettings?.lunchTimeStart;   // 12:00 em minutos
    const lunchEnd = deliveryType.AvailabilitySettings?.lunchTimeEnd;     // 13:00 em minutos
    const activityDuration = deliveryType.AvailabilitySettings?.duration;  // Ex.: 60 minutos por slot (ajuste conforme necessário)

    if (!lunchStart || !lunchEnd || !activityDuration) {
      return NextResponse.json(
        { message: "Lunch time or activity duration not found" },
        { status: 404 }
      );
    }

    // 3) Busca todos os slots disponíveis (em minutos) para essa data
    const slots = await getAvailableSlotsForDate({
      deliveryTypeId,
      date,
      activityDuration,
      lunchStart,
      lunchEnd,
    });

    // 4) Mapeia somente start → “HH:MM”
    const times: string[] = slots.map((s) => formatHHMM(s.start));

    // 5) Retorna { times: ["08:00", "09:00", …] }
    return NextResponse.json({ times });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro interno ao buscar horários disponíveis." },
      { status: 500 }
    );
  }
}
