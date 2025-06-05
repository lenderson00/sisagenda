import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { deliveryTypeId: string } },
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orgId = session.user.organizationId;

    if (!orgId) {
      return new NextResponse("Organization ID is required", { status: 400 });
    }

    const deliveryType = await prisma.deliveryType.findFirst({
      where: {
        id: params.deliveryTypeId,
        organizationId: orgId,
        deletedAt: null,
      },
    });

    if (!deliveryType) {
      return new NextResponse("Delivery type not found", { status: 404 });
    }

    return NextResponse.json(deliveryType);
  } catch (error) {
    console.error("[DELIVERY_TYPE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { deliveryTypeId: string } },
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deliveryType = await prisma.deliveryType.delete({
      where: {
        id: params.deliveryTypeId,
      },
    });

    return NextResponse.json(deliveryType);
  } catch (error) {
    console.error("[DELIVERY_TYPE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
