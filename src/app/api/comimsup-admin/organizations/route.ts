import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "COMRJ_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const organizations = await prisma.organization.findMany({
      where: {
        role: "DEPOSITO", // Only show deposits
        id: {
          not: session.user.organizationId,
        },
      },
      include: {
        _count: {
          select: {
            appointments: true,
          },
        },
        appointments: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Calculate appointment statistics for each organization
    const organizationsWithStats = organizations.map(org => {
      const totalAppointments = org._count.appointments;
      const pendingAppointments = org.appointments.filter(
        appointment => appointment.status === "PENDING_CONFIRMATION"
      ).length;
      const completedAppointments = org.appointments.filter(
        appointment => appointment.status === "COMPLETED"
      ).length;

      return {
        ...org,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        // Remove the raw appointments and _count from the response
        appointments: undefined,
        _count: undefined,
      };
    });

    return NextResponse.json(organizationsWithStats);
  } catch (error) {
    console.error("[ORGANIZATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
