import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createDeliveryTypeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  duration: z.number().min(1, "Duração é obrigatória"),
  organizationId: z.string(),
});

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orgId = session.user.organizationId;

    const deliveryTypes = await prisma.deliveryType.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(deliveryTypes);
  } catch (error) {
    console.error("[DELIVERY_TYPES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = createDeliveryTypeSchema.parse(body);

    // Create slug from name
    const slug = validatedData.name
      .toLowerCase()
      .normalize("NFD")
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const deliveryType = await prisma.deliveryType.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        slug,
        duration: validatedData.duration || 60, // 60 minutes
        isVisible: true,
        organizationId: validatedData.organizationId,
      },
    });

    return NextResponse.json(deliveryType);
  } catch (error) {
    console.error("[DELIVERY_TYPES_POST]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}
