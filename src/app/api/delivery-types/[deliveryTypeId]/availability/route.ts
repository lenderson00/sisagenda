import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTime: z.number(),
      endTime: z.number(),
    })
  ),
});

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ deliveryTypeId: string }> }
) => {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const orgId = session.user.organizationId;

  if (!orgId) {
    return new NextResponse("Organization ID is required", { status: 400 });
  }

  try {
    const deliveryTypeId = (await params).deliveryTypeId;
    const availability = await prisma.availability.findMany({
      where: {
        deliveryTypeId: deliveryTypeId,
        organizationId: orgId,
      },
    });

    const availabilityDTO = availability.map((availability) => {
      return {
        weekDay: availability.weekDay,
        startTime: availability.startTime,
        endTime: availability.endTime,
      };
    });

    const possibleTimes = [];
    const availableTimes = [];

    for (const availability of availabilityDTO) {
      for (let i = availability.startTime; i < availability.endTime; i++) {
        possibleTimes.push(i);
        if (availability.weekDay === new Date().getDay()) {
          availableTimes.push(i);
        }
      }
    }

    return NextResponse.json({
      possibleTimes,
      availableTimes,
    });
  } catch (error) {
    console.error("[AVAILABILITY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ deliveryTypeId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orgId = session.user.organizationId;

    if (!orgId) {
      return new NextResponse("Organization ID is required", { status: 400 });
    }

    const deliveryTypeId = (await params).deliveryTypeId;

    const { intervals } = timeIntervalsBodySchema.parse(await req.json());

    // Delete existing availability records for this delivery type
    await prisma.availability.deleteMany({
      where: {
        deliveryTypeId: deliveryTypeId,
      },
    });

    const values = intervals.map((interval) => {
      return {
        weekDay: interval.weekDay,
        startTime: interval.startTime,
        endTime: interval.endTime,
        organizationId: orgId,
        deliveryTypeId: deliveryTypeId,
      };
    });

    // // Create new availability records
    await Promise.all(
      values.map((value) => {
        return prisma.availability.create({
          data: {
            ...value,
          },
        });
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[AVAILABILITY_POST]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}
