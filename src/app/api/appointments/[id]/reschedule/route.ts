import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { reason, newDate } = body;

    if (!reason || !newDate) {
      return NextResponse.json(
        { error: "Reason and new date are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
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

    if (["COMPLETED", "CANCELLATION_REQUESTED", "CANCELLED"].includes(appointment.status)) {
      return NextResponse.json(
        { error: "Appointment already completed or cancelled" },
        { status: 400 },
      );
    }

    // Update appointment status to reschedule requested
    await prisma.appointment.update({
      where: { id },
      data: {
        status: "RESCHEDULE_REQUESTED",
      },
    });

    // Create activity record
    await prisma.appointmentActivity.create({
      data: {
        type: "RESCHEDULE_REQUESTED",
        title: "Solicitação de Reagendamento",
        content: `${reason}. Nova data proposta: ${new Date(newDate).toLocaleDateString("pt-BR")}`,
        appointmentId: id,
        userId: user.id,
        previousStatus: appointment.status,
        newStatus: "RESCHEDULE_REQUESTED",
        metadata: {
          proposedDate: newDate,
          originalDate: appointment.date.toISOString(),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reschedule appointment:", error);
    return NextResponse.json(
      { error: "Failed to reschedule appointment" },
      { status: 500 },
    );
  }
}
