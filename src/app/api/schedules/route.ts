import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";
import { ScheduleFormSchema } from "@/app/admin/disponibilidade/[id]/_hooks/use-schedule-form";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { name, availability } = ScheduleFormSchema.parse(json);

    const schedule = await db.schedule.create({
      data: {
        name,
        organizationId: session.user.organizationId,
        availability: {
          create: (availability && availability.length > 0)
            ? availability.flatMap((day, weekDay) =>
              day.map((slot) => ({
                weekDay: weekDay,
                startTime: slot.start.getHours() * 60 + slot.start.getMinutes(),
                endTime: slot.end.getHours() * 60 + slot.end.getMinutes(),
                organization: {
                  connect: { id: session.user.organizationId },
                },
              }))
            )
            : Array.from({ length: 7 }, (_, weekDay) => ({
              weekDay: weekDay,
              startTime: 9 * 60,
              endTime: 16 * 60,
              organization: {
                connect: { id: session.user.organizationId },
              },
            })),
        },
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
