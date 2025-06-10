import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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
    include: {
      organization: true,
      availabilityRules: true,
    },
  });

  if (!deliveryType) {
    return NextResponse.json(
      { error: "DeliveryType not found" },
      { status: 404 },
    );
  }

  console.log("DELIVERY TYPE", deliveryType.availabilityRules?.rule);

  if (deliveryType.organizationId !== session.user.organizationId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rule = deliveryType.availabilityRules;

  if (!rule) {
    await prisma.availabilityRule.create({
      data: {
        deliveryTypeId: deliveryType.id,
        rule: [],
      },
    });
    return NextResponse.json([]);
  }

  const ruleDTO = rule.rule ? rule.rule : [];

  return NextResponse.json(ruleDTO);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { deliveryTypeId, rules } = body;

  if (
    !deliveryTypeId ||
    !rules ||
    !Array.isArray(rules) ||
    rules.length === 0
  ) {
    return NextResponse.json(
      { error: "DeliveryTypeId and rules array are required" },
      { status: 400 },
    );
  }

  const deliveryType = await prisma.deliveryType.findUnique({
    where: { id: deliveryTypeId },
    include: {
      organization: true,
      availabilityRules: true,
    },
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

  // Upsert the rule - create if doesn't exist, update if it does
  const rule = await prisma.availabilityRule.upsert({
    where: {
      deliveryTypeId: deliveryType.id,
    },
    create: {
      deliveryTypeId: deliveryType.id,
      rule: rules,
    },
    update: {
      rule: rules,
    },
  });

  console.log("RULE", rule);

  return NextResponse.json({ rule: rule.rule });
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
      deliveryTypeId: deliveryTypeId,
    },
    create: {
      deliveryTypeId: deliveryTypeId,
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
      deliveryTypeId: deliveryTypeId,
    },
    create: {
      deliveryTypeId: deliveryTypeId,
      rule: [],
    },
    update: {
      rule: [],
    },
  });

  return NextResponse.json(rule);
}
