import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ deliveryTypeId: string }> },
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

    const { deliveryTypeId } = await params;

    const deliveryType = await prisma.deliveryType.findFirst({
      where: {
        id: deliveryTypeId,
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
  { params }: { params: Promise<{ deliveryTypeId: string }> },
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { deliveryTypeId } = await params;

    const deliveryType = await prisma.deliveryType.delete({
      where: {
        id: deliveryTypeId,
      },
    });

    return NextResponse.json(deliveryType);
  } catch (error) {
    console.error("[DELIVERY_TYPE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ deliveryTypeId: string }> },
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { deliveryTypeId } = await params;
    const body = await req.json();

    const deliveryType = await prisma.deliveryType.update({
      where: {
        id: deliveryTypeId,
        organizationId: session.user.organizationId,
      },
      data: body,
    });

    return NextResponse.json(deliveryType);
  } catch (error) {
    console.error("[DELIVERY_TYPE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
