import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const scheduleId = searchParams.get("scheduleId");

  if (!scheduleId) {
    return NextResponse.json(
      { error: "Schedule ID is required" },
      { status: 400 },
    );
  }

  const availabilityRule = await prisma.availabilityRule.findMany({
    where: {
      scheduleId: scheduleId,
    },
  });

  return NextResponse.json(availabilityRule);
}

const createRuleSchema = z.object({
  scheduleId: z.string(),
  rules: z.array(
    z.object({
      date: z.string(),
      isAllDay: z.boolean(),
      startTime: z.number(),
      endTime: z.number(),
      comment: z.string(),
    }),
  ),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { scheduleId, rules } = createRuleSchema.parse(body);

  const schedule = await prisma.schedule.findUnique({
    where: {
      id: scheduleId,
      organizationId: session.user.organizationId,
    },
  });

  if (!schedule) {
    return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
  }

  // Step 1: Prepare the data for bulk creation
  const rulesData = rules.map((rule) => ({
    scheduleId: scheduleId,
    isAllDay: rule.isAllDay,
    date: rule.date ? new Date(rule.date) : undefined,
    startTime: rule.startTime,
    endTime: rule.endTime,
    comment: rule.comment,
  }));

  // Step 2: Use createMany for efficient bulk insert
  await prisma.availabilityRule.createMany({
    data: rulesData,
    skipDuplicates: true,
  });

  // Step 3: Return a success response
  return NextResponse.json({ success: true });
}

const updateRuleSchema = z.object({
  scheduleId: z.string(),
  availabilityRuleId: z.string(),
  isAllDay: z.boolean().optional(),
  date: z.string().optional(),
  startTime: z.number().optional(),
  endTime: z.number().optional(),
  comment: z.string().optional(),
});
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    scheduleId,
    availabilityRuleId,
    isAllDay,
    date,
    startTime,
    endTime,
    comment,
  } = updateRuleSchema.parse(body);

  const schedule = await prisma.schedule.findUnique({
    where: {
      id: scheduleId,
      organizationId: session.user.organizationId,
    },
  });

  if (!schedule) {
    return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
  }

  const availabilityRule = await prisma.availabilityRule.findUnique({
    where: {
      id: availabilityRuleId,
    },
  });

  if (!availabilityRule) {
    return NextResponse.json(
      { error: "Availability rule not found" },
      { status: 404 },
    );
  }

  await prisma.availabilityRule.update({
    where: { id: availabilityRuleId },
    data: {
      isAllDay,
      date: date ? new Date(date) : undefined,
      startTime: startTime,
      endTime: endTime,
      comment,
    },
  });

  return NextResponse.json({ success: true });
}

const deleteRuleSchema = z.object({
  availabilityRuleId: z.string(),
});

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { availabilityRuleId } = deleteRuleSchema.parse(body);

  await prisma.availabilityRule.deleteMany({
    where: {
      id: availabilityRuleId,
    },
  });

  return NextResponse.json({ success: true });
}
