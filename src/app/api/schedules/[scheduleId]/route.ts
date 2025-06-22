import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";
import { ScheduleFormSchema } from "@/app/admin/disponibilidade/[id]/_hooks/use-schedule-form";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { scheduleId } = await params;

    const schedule = await db.schedule.findUnique({
      where: {
        id: scheduleId,
        organizationId: session.user.organizationId,
      },
      include: {
        availability: true,
      },
    });

    if (!schedule) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(schedule);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { scheduleId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { name, availability } = ScheduleFormSchema.parse(json);

    await db.$transaction(async (tx) => {
      await tx.availability.deleteMany({
        where: { scheduleId: params.scheduleId },
      });

      await tx.schedule.update({
        where: {
          id: params.scheduleId,
          organizationId: session.user.organizationId,
        },
        data: {
          name,
          availability: {
            create: availability.flatMap((day, weekDay) =>
              day.map((slot) => ({
                weekDay: weekDay,
                startTime: slot.start.getHours() * 60 + slot.start.getMinutes(),
                endTime: slot.end.getHours() * 60 + slot.end.getMinutes(),
                organization: {
                  connect: { id: session.user.organizationId },
                },
              }))
            ),
          },
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
