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

    const appointments = await prisma.appointment.findMany({
      where: {
        organizationId: organizationId,
      },
      include: {
        deliveryType: true,
        user: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const serializedAppointments = appointments.map((appointment) => ({
      ...appointment,
      items: [], // placeholder for now
    }));

    return NextResponse.json(serializedAppointments);
  } catch (error) {
    console.error("[ORGANIZATION_APPOINTMENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
