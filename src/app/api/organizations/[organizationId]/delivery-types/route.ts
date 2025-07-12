import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ organizationId: string }> },
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "COMRJ_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { organizationId } = await params;

    const deliveryTypes = await prisma.deliveryType.findMany({
      where: {
        organizationId: organizationId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(deliveryTypes);
  } catch (error) {
    console.error("[ORGANIZATION_DELIVERY_TYPES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
