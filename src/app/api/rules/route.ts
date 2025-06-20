import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const availabilityRule = await prisma.availabilityRule.findMany({
    where: {
      organizationId: session.user.organizationId,
    },
    include: {
      deliveryTypes: {
        select: {
          id: true,
        },
      },
    },
  });

  return NextResponse.json(availabilityRule);
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

  const existingRule = await prisma.availabilityRule.findFirst({
    where: {
      organizationId: session.user.organizationId,
    },
  });

  if (existingRule) {
    // Update existing rule
    const updatedRule = await prisma.availabilityRule.update({
      where: {
        id: existingRule.id,
      },
      data: {
        rule: rules,
        deliveryTypes: {
          set: deliveryTypeIds.map((id) => ({ id })),
        },
      },
      include: {
        deliveryTypes: true,
      },
    });
    return NextResponse.json(updatedRule);
  }

  // Create new rule
  const newRule = await prisma.availabilityRule.create({
    data: {
      organizationId: session.user.organizationId,
      rule: rules,
      deliveryTypes: {
        connect: deliveryTypeIds.map((id) => ({ id })),
      },
    },
    include: {
      deliveryTypes: true,
    },
  });
  return NextResponse.json(newRule);
}
