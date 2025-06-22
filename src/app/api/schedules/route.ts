import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";

const ScheduleFormSchema = z.object({
  name: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const orgId = session?.user?.organizationId;

    if (!orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { name } = ScheduleFormSchema.parse(json);

    const schedule = await db.schedule.create({
      data: {
        name,
        organizationId: orgId,
        availability: {
          createMany: {
            data: Array.from({ length: 5 }, (_, weekDay) => ({
              weekDay: weekDay + 1, // De Segunda a Sexta-feira
              startTime: 9 * 60, // 9:00
              endTime: 16 * 60, // 16:00
              organizationId: orgId,
            })),
          },
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
