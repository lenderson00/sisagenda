import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppointmentService } from "@/lib/services/appointment-service";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const actionSchema = z.object({
  action: z.enum([
    "approve",
    "reject",
    "cancel",
    "request_cancellation",
    "approve_cancellation",
    "reject_cancellation",
    "mark_as_no_show",
    "mark_as_completed",
    "request_reschedule",
    "approve_reschedule",
    "reject_reschedule",
    "reschedule",
  ]),
  payload: z.any().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validation = actionSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(validation.error.message, { status: 400 });
    }

    const { action, payload } = validation.data;
    const { id: appointmentId } = await params;

    const appointmentService = new AppointmentService(session);

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
        deletedAt: null,
      },
    });

    const lockEvent = [
      "COMPLETED",
      "CANCELLED",
      "RESCHEDULE_REJECTED",
      "RESCHEDULE_APPROVED",
    ];

    if (!appointment || lockEvent.includes(appointment.status)) {
      return new NextResponse(
        "Agendamento não encontrado ou não pode ser alterado",
        { status: 404 },
      );
    }

    switch (action) {
      case "approve":
        await appointmentService.approve(appointmentId);
        break;
      case "reject":
        await appointmentService.reject(appointmentId);
        break;
      case "cancel":
        await appointmentService.cancel(appointmentId);
        break;
      case "request_cancellation":
        await appointmentService.requestCancellation(appointmentId);
        break;
      case "approve_cancellation":
        await appointmentService.approveCancellation(appointmentId);
        break;
      case "reject_cancellation":
        await appointmentService.rejectCancellation(appointmentId);
        break;
      case "request_reschedule": {
        const { newDate, reason } = payload;
        await appointmentService.requestReschedule(
          appointmentId,
          new Date(newDate),
          reason,
        );
        break;
      }
      case "reschedule": {
        const { newDate, reason } = payload;
        await appointmentService.reschedule(
          appointmentId,
          new Date(newDate),
          reason,
        );
        break;
      }
      case "approve_reschedule":
        await appointmentService.approveReschedule(appointmentId);
        break;
      case "reject_reschedule":
        await appointmentService.rejectReschedule(appointmentId);
        break;
      case "mark_as_no_show":
        await appointmentService.markAsNoShow(appointmentId);
        break;
      case "mark_as_completed":
        await appointmentService.markAsCompleted(appointmentId);
        break;
      default:
        return new NextResponse("Invalid action", { status: 400 });
    }

    const updatedAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        user: true,
        deliveryType: true,
        items: true,
        activities: true,
        attachments: true,
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
