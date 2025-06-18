import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const organization = await prisma.organization.findUnique({
    where: {
      id: session.user.organizationId,
    },
    include: {
      AvailabilityRule: true
    },
  });

  const rules = organization?.AvailabilityRule || [];

  return NextResponse.json(rules);
}

const createRuleSchema = z.object({
  deliveryTypeIds: z.array(z.string()),
  rules: z.array(z.any()),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { deliveryTypeIds, rules } = createRuleSchema.parse(body);

  // Upsert the rule - create if doesn't exist, update if it does
  const { rule } = await prisma.availabilityRule.upsert({
    where: {
      organizationId: session.user.organizationId,
    },
    create: {
      organizationId: session.user.organizationId,
      deliveryTypes: {
        connect: deliveryTypeIds.map((id) => ({ id })),
      },
      rule: rules,
    },
    update: {
      organizationId: session.user.organizationId,
      deliveryTypes: {
        connect: deliveryTypeIds.map((id) => ({ id })),
      },
      rule: rules,
    },
  });

  return NextResponse.json({ rule });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { rules, deliveryTypeId } = body;

  if (!deliveryTypeId || !rules || !Array.isArray(rules)) {
    return NextResponse.json(
      { error: "DeliveryTypeId and rules array are required" },
      { status: 400 },
    );
  }

  const deliveryType = await prisma.deliveryType.findUnique({
    where: { id: deliveryTypeId },
    select: { organizationId: true },
  });

  if (!deliveryType) {
    return NextResponse.json(
      { error: "DeliveryType not found" },
      { status: 404 },
    );
  }

  if (deliveryType.organizationId !== session.user.organizationId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!deliveryType.organizationId) {
    return NextResponse.json(
      { error: "OrganizationId not found" },
      { status: 404 },
    );
  }

  // Upsert the rule - create if doesn't exist, update if it does
  const rule = await prisma.availabilityRule.upsert({
    where: {
      organizationId: session.user.organizationId,
    },
    create: {
      organizationId: session.user.organizationId,
      rule: rules,
    },
    update: {
      rule: rules,
    },
  });

  return NextResponse.json({ rule: rule.rule });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const deliveryTypeId = searchParams.get("deliveryTypeId");
  if (!deliveryTypeId) {
    return NextResponse.json(
      { error: "DeliveryTypeId is required" },
      { status: 400 },
    );
  }

  const deliveryType = await prisma.deliveryType.findUnique({
    where: { id: deliveryTypeId },
    select: { organizationId: true },
  });

  if (!deliveryType) {
    return NextResponse.json(
      { error: "DeliveryType not found" },
      { status: 404 },
    );
  }

  if (deliveryType.organizationId !== session.user.organizationId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Instead of deleting, we'll set an empty array of rules
  const rule = await prisma.availabilityRule.upsert({
    where: {
      organizationId: session.user.organizationId,
    },
    create: {
      organizationId: session.user.organizationId,
      rule: [],
    },
    update: {
      rule: [],
    },
  });

  return NextResponse.json(rule);
}
