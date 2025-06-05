import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ deliveryTypeId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { deliveryTypeId } = await params;

    const organizationId = session.user.organizationId;

    if (!organizationId) {
      return new NextResponse("Organização não encontrada", { status: 400 });
    }


    const body = await req.json();
    const { startTime, endTime } = body;

    if (!deliveryTypeId || !startTime || !endTime) {
      return new NextResponse("Horário de almoço é obrigatório", { status: 400 });
    }


    const deliveryType = await prisma.availabilitySettings.upsert({
      where: {
        deliveryTypeId,
      },
      update: {
        lunchTimeStart: convertTimeToMinutes(startTime),
        lunchTimeEnd: convertTimeToMinutes(endTime),
      },
      create: {
        deliveryTypeId,
        lunchTimeStart: convertTimeToMinutes(startTime),
        lunchTimeEnd: convertTimeToMinutes(endTime),
      },
    });

    return NextResponse.json(deliveryType);
  } catch (error) {
    console.error("[DELIVERY_TYPE_LUNCH_TIME_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

const convertTimeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};