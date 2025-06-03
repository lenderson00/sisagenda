import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ deliveryType: string, availability: string }> }
) {
  const { deliveryType, availability } = await params;

  const searchParams = new URL(request.url).searchParams;
  const date = searchParams.get("date");

  const referenceDate = dayjs(String(date));
  const isPastDate = referenceDate.endOf("day").isBefore(new Date());

  if (isPastDate) {
    return NextResponse.json({
      availability: [],
    });
  }

  const deliveryTypeAvailability = await prisma.availability.findFirst({
    where: {
      deliveryTypeId: deliveryType,
      weekDay: referenceDate.get("day"),
    },
    include: {
      availabilityRule: true,
    },
  });

  if (!deliveryTypeAvailability) {
    return NextResponse.json({
      availability: [],
    });
  }

  const { startTime, endTime } = deliveryTypeAvailability;

  const startHour = startTime / 60;
  const endHour = endTime / 60;

  const rule = deliveryTypeAvailability.availabilityRule?.rule || [];


  const blockedTimes = await prisma.appointment.findMany({
    where: {
      organizationId: deliveryTypeAvailability.organizationId,
      deliveryTypeId: deliveryType,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
    select: {
      date: true,
    },
  });


  return NextResponse.json({
    date,
  });
}