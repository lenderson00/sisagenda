import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { reason } = body;

    if (!reason) {
      return NextResponse.json(
        { error: "Reason is required" },
        { status: 400 },
      );
    }

    // Check if appointment exists and belongs to the user
    const appointment = await prisma.appointment.findUnique({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    // Update appointment status to cancellation requested
    await prisma.appointment.update({
      where: { id },
      data: {
        status: "CANCELLATION_REQUESTED",
      },
    });

    // Create activity record
    await prisma.appointmentActivity.create({
      data: {
        type: "CANCELLED",
        title: "Solicitação de Cancelamento",
        content: reason,
        appointmentId: id,
        userId: session.user.id,
        previousStatus: appointment.status,
        newStatus: "CANCELLATION_REQUESTED",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to cancel appointment:", error);
    return NextResponse.json(
      { error: "Failed to cancel appointment" },
      { status: 500 },
    );
  }
}
