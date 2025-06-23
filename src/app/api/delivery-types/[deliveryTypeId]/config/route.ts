import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const DEFAULT_SETTINGS = {
  duration: 60,
  lunchTimeStart: 720, // 12:00
  lunchTimeEnd: 780, // 13:00
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ deliveryTypeId: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { deliveryTypeId } = await params;

    if (!deliveryTypeId) {
      return new NextResponse("ID do tipo de entrega é obrigatório", {
        status: 400,
      });
    }

    const deliveryType = await prisma.deliveryType.findUnique({
      where: {
        id: deliveryTypeId,
        organizationId: session.user.organizationId,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        updatedAt: true,
        duration: true,
        lunchTimeStart: true,
        lunchTimeEnd: true,
      },
    });

    if (!deliveryType) {
      return new NextResponse("Tipo de entrega não encontrado", {
        status: 404,
      });
    }

    let settings = {
      duration: deliveryType.duration,
      lunchTimeStart: deliveryType.lunchTimeStart,
      lunchTimeEnd: deliveryType.lunchTimeEnd,
    };

    return NextResponse.json({
      id: deliveryType.id,
      name: deliveryType.name,
      isActive: deliveryType.isActive,
      updatedAt: deliveryType.updatedAt,
      duration: settings.duration,
      lunchStartTime: formatTimeFromMinutes(settings.lunchTimeStart),
      lunchEndTime: formatTimeFromMinutes(settings.lunchTimeEnd),
    });
  } catch (error) {
    console.error("[DELIVERY_TYPE_CONFIG_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

function formatTimeFromMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}
