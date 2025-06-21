import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
    const { duration } = body;

    if (!duration) {
      return new NextResponse("Duração é obrigatória", { status: 400 });
    }

    const organizationId = session.user.organizationId;
    if (!organizationId) {
      return new NextResponse("Organização não encontrada", { status: 400 });
    }

    const orgDeliveryTypes = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      include: {
        deliveryTypes: true,
      },
    });

    if (!orgDeliveryTypes) {
      return new NextResponse("Organização não encontrada", { status: 400 });
    }

    const deliveryTypeToUpdate = orgDeliveryTypes.deliveryTypes.find(
      (dt) => dt.id === deliveryTypeId,
    );

    if (!deliveryTypeToUpdate) {
      return new NextResponse("Tipo de entrega não encontrado", {
        status: 400,
      });
    }

    const deliveryType = await prisma.deliveryType.update({
      where: {
        id: deliveryTypeToUpdate.id,
      },
      data: {
        duration,
      },
    });

    return NextResponse.json(deliveryType);
  } catch (error) {
    console.error("[DELIVERY_TYPE_DURATION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
