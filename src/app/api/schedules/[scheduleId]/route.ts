import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ scheduleId: string }> },
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

const ScheduleFormSchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTime: z.number(),
      endTime: z.number(),
    }),
  ),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ scheduleId: string }> },
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
    });

    if (!schedule) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const json = await req.json();
    const { intervals } = ScheduleFormSchema.parse(json);

    await db.$transaction(async (tx) => {
      await tx.availability.deleteMany({
        where: { scheduleId },
      });

      await tx.schedule.update({
        where: {
          id: scheduleId,
        },
        data: {
          availability: {
            createMany: {
              data: intervals,
            },
          },
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
