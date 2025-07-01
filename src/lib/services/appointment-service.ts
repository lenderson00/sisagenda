import { prisma } from "@/lib/prisma";
import { type Appointment, AppointmentStatus, ActivityType } from "@prisma/client";
import type { Session } from "next-auth";
import {
  notifyAppointmentCreated,
  notifyAppointmentConfirmed,
  notifyAppointmentRejected,
  notifyAppointmentCancelled,
  notifyAppointmentCompleted,
  notifyAppointmentSupplierNoShow,
  notifyAppointmentRescheduleRequested,
  notifyAppointmentRescheduled,
} from "./notification-utils";
import { endOfDay, startOfDay, startOfWeek, endOfWeek, addDays } from "date-fns";

type AppointmentWithRelations = Appointment & {
  deliveryType: {
    organizationId: string;
  };
};

/**
 * Service for managing appointments with integrated notification system.
 *
 * For appointment creation, use the static method:
 * await AppointmentService.notifyAppointmentCreated(appointmentId, organizationId, createdByUserId);
 */
export class AppointmentService {
  private user: Session["user"];

  constructor(session: Session) {
    if (!session?.user?.id || !session.user.role) {
      throw new Error("User not authenticated");
    }
    this.user = session.user;
  }

  /**
   * Static method to notify about appointment creation.
   * Call this after creating a new appointment.
   *
   * @param appointmentId - ID of the created appointment
   * @param organizationId - Organization ID where the appointment was created
   * @param createdByUserId - ID of the user who created the appointment
   */
  static async notifyAppointmentCreated(
    appointmentId: string,
    organizationId: string,
    createdByUserId: string
  ): Promise<void> {
    await notifyAppointmentCreated(appointmentId, organizationId, createdByUserId);
  }

  private async getAppointment(
    appointmentId: string,
  ): Promise<AppointmentWithRelations | null> {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { deliveryType: true },
    });
    return appointment;
  }

  private isUserAuthorized(appointment: AppointmentWithRelations): boolean {
    const userRole = this.user.role;
    if (userRole === "COMIMSUP") {
      return true;
    }
    if (userRole === "FORNECEDOR") {
      return appointment.userId === this.user.id;
    }
    if (userRole === "ADMIN" || userRole === "USER") {
      return (
        appointment.deliveryType.organizationId === this.user.organizationId
      );
    }
    return false;
  }

  async approve(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId);
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error("Not authorized");
    }

    if (this.user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    if (appointment.status !== "PENDING_CONFIRMATION") {
      throw new Error("Invalid action for current appointment status");
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "STATUS_CHANGE",
          title: "Agendamento Aprovado",
          content: "O agendamento foi aprovado pelo administrador.",
          previousStatus: "PENDING_CONFIRMATION",
          newStatus: "CONFIRMED",
        },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "CONFIRMED",
          title: "Agendamento confirmado",
          content: "O sistema confirmou o agendamento.",
        },
      });
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "CONFIRMED" },
      });
      return updatedAppointment;
    });

    // 🔔 DISPATCH NOTIFICATION
    await notifyAppointmentConfirmed(
      appointmentId,
      appointment.deliveryType.organizationId,
      this.user.id
    );

    return result;
  }

  async reject(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId);
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error("Not authorized");
    }

    if (this.user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    if (appointment.status !== "PENDING_CONFIRMATION") {
      throw new Error("Invalid action for current appointment status");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "REJECTED" },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "STATUS_CHANGE",
          title: "Agendamento Rejeitado",
          content: "O agendamento foi rejeitado pelo administrador.",
          previousStatus: "PENDING_CONFIRMATION",
          newStatus: "REJECTED",
        },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "CANCELLED",
          title: "Agendamento Cancelado",
          content: "O sistema cancelou o agendamento.",
          previousStatus: "REJECTED",
          newStatus: "CANCELLED",
        },
      });
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "CANCELLED" },
      });
      return updatedAppointment;
    });

    // 🔔 DISPATCH NOTIFICATION
    await notifyAppointmentRejected(
      appointmentId,
      appointment.deliveryType.organizationId,
      this.user.id
    );

    return result;
  }

  async cancel(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId);
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error("Not authorized");
    }

    if (this.user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    const previousStatus = appointment.status;

    const result = await prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "CANCELLED" },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "CANCELLED",
          title: "Agendamento Cancelado",
          content: "O agendamento foi cancelado pelo administrador.",
          previousStatus,
          newStatus: "CANCELLED",
        },
      });
      return updatedAppointment;
    });

    // 🔔 DISPATCH NOTIFICATION
    await notifyAppointmentCancelled(
      appointmentId,
      appointment.deliveryType.organizationId,
      this.user.id
    );

    return result;
  }

  async requestCancellation(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId);
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error("Not authorized");
    }

    if (this.user.role !== "FORNECEDOR") {
      throw new Error("Forbidden");
    }

    const previousStatus = appointment.status;
    if (
      previousStatus !== "PENDING_CONFIRMATION" &&
      previousStatus !== "CONFIRMED"
    ) {
      throw new Error("Invalid action for current appointment status");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "CANCELLATION_REQUESTED" },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "STATUS_CHANGE",
          title: "Solicitação de Cancelamento",
          content: "O fornecedor solicitou o cancelamento do agendamento.",
          previousStatus,
          newStatus: "CANCELLATION_REQUESTED",
        },
      });
      return updatedAppointment;
    });

    // 🔔 DISPATCH NOTIFICATION - notify organization users about cancellation request
    await notifyAppointmentCancelled(
      appointmentId,
      appointment.deliveryType.organizationId,
      this.user.id,
      "Fornecedor solicitou cancelamento"
    );

    return result;
  }

  async approveCancellation(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId);
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error("Not authorized");
    }
    if (this.user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }
    if (appointment.status !== "CANCELLATION_REQUESTED") {
      throw new Error("Invalid action for current appointment status");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "CANCELLED" },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "STATUS_CHANGE",
          title: "Cancelamento Aprovado",
          content:
            "A solicitação de cancelamento foi aprovada pelo administrador.",
          previousStatus: "CANCELLATION_REQUESTED",
          newStatus: "CANCELLED",
        },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "CANCELLED",
          title: "Cancelamento Aprovado",
          content: "O agendamento foi cancelado pelo sistema.",
          previousStatus: "CANCELLATION_REQUESTED",
          newStatus: "CANCELLED",
        },
      });
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "CANCELLED" },
      });
      return updatedAppointment;
    });

    // 🔔 DISPATCH NOTIFICATION
    await notifyAppointmentCancelled(
      appointmentId,
      appointment.deliveryType.organizationId,
      this.user.id,
      "Solicitação de cancelamento aprovada"
    );

    return result;
  }

  async rejectCancellation(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId);
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error("Not authorized");
    }
    if (this.user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }
    if (appointment.status !== "CANCELLATION_REQUESTED") {
      throw new Error("Invalid action for current appointment status");
    }

    const lastActivity = await prisma.appointmentActivity.findFirst({
      where: {
        appointmentId,
        newStatus: "CANCELLATION_REQUESTED",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const previousStatus = lastActivity?.previousStatus || "CONFIRMED";

    return prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: previousStatus },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "STATUS_CHANGE",
          title: "Cancelamento Rejeitado",
          content:
            "A solicitação de cancelamento foi rejeitada pelo administrador.",
          previousStatus: "CANCELLATION_REQUESTED",
          newStatus: previousStatus,
        },
      });

      await notifyAppointmentCancelled(
        appointmentId,
        appointment.deliveryType.organizationId,
        this.user.id,
        "Solicitação de cancelamento rejeitada"
      );

      return updatedAppointment;

    });


  }

  async markAsNoShow(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId);
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error("Not authorized");
    }
    if (this.user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }
    if (
      appointment.status !== "CONFIRMED" ||
      new Date(appointment.date) >= new Date()
    ) {
      throw new Error("Invalid action for current appointment status or date");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "SUPPLIER_NO_SHOW" },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "SUPPLIER_NO_SHOW",
          title: "Fornecedor não compareceu",
          content: "O administrador marcou que o fornecedor não compareceu.",
          previousStatus: "CONFIRMED",
          newStatus: "SUPPLIER_NO_SHOW",
        },
      });
      return updatedAppointment;
    });

    // 🔔 DISPATCH NOTIFICATION
    await notifyAppointmentSupplierNoShow(
      appointmentId,
      appointment.deliveryType.organizationId,
      this.user.id
    );

    return result;
  }

  async markAsCompleted(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId);
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error("Not authorized");
    }
    if (this.user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }
    if (
      appointment.status !== "CONFIRMED" ||
      new Date(appointment.date) >= new Date()
    ) {
      throw new Error("Invalid action for current appointment status or date");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "COMPLETED" },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "COMPLETED",
          title: "Agendamento concluído",
          content:
            "O agendamento foi marcado como concluído pelo administrador.",
          previousStatus: "CONFIRMED",
          newStatus: "COMPLETED",
        },
      });
      return updatedAppointment;
    });

    // 🔔 DISPATCH NOTIFICATION
    await notifyAppointmentCompleted(
      appointmentId,
      appointment.deliveryType.organizationId,
      this.user.id
    );

    return result;
  }

  async requestReschedule(
    appointmentId: string,
    newDate: Date,
    reason: string,
  ) {
    const appointment = await this.getAppointment(appointmentId);
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error("Not authorized");
    }

    if (this.user.role !== "FORNECEDOR") {
      throw new Error("Forbidden");
    }

    const previousStatus = appointment.status;
    if (
      previousStatus !== "PENDING_CONFIRMATION" &&
      previousStatus !== "CONFIRMED"
    ) {
      throw new Error("Invalid action for current appointment status");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "RESCHEDULE_REQUESTED" },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "RESCHEDULE_REQUESTED",
          title: "Solicitação de Reagendamento",
          content: reason,
          metadata: {
            newDate: newDate.toISOString(),
          },
          previousStatus,
          newStatus: "RESCHEDULE_REQUESTED",
        },
      });

      return updatedAppointment;
    });

    // 🔔 DISPATCH NOTIFICATION
    await notifyAppointmentRescheduleRequested(
      appointmentId,
      appointment.deliveryType.organizationId,
      this.user.id,
      newDate,
      reason
    );

    return result;
  }

  async approveReschedule(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId);
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error("Not authorized");
    }
    if (this.user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }
    if (appointment.status !== "RESCHEDULE_REQUESTED") {
      throw new Error("Invalid action for current appointment status");
    }

    const lastActivity = await prisma.appointmentActivity.findFirst({
      where: { appointmentId, type: "RESCHEDULE_REQUESTED" },
      orderBy: { createdAt: "desc" },
    });

    const newDate = (lastActivity?.metadata as any)?.newDate;
    if (!newDate) {
      throw new Error("Could not find new date in reschedule request");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "RESCHEDULED", date: new Date(newDate) },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "STATUS_CHANGE",
          title: "Reagendamento Aprovado",
          content:
            "A solicitação de reagendamento foi aprovada pelo administrador.",
          previousStatus: "RESCHEDULE_REQUESTED",
          newStatus: "RESCHEDULED",
        },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "STATUS_CHANGE",
          title: "Agendamento Reagendado",
          content: `O sistema confirmou o agendamento para ${newDate.toLocaleString()}.`,
          previousStatus: "RESCHEDULED",
          newStatus: "CONFIRMED",
        },
      });

      await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "CONFIRMED" },
      });
      return updatedAppointment;
    });

    // 🔔 DISPATCH NOTIFICATION
    await notifyAppointmentRescheduled(
      appointmentId,
      appointment.deliveryType.organizationId,
      this.user.id,
      appointment.date // previous date
    );

    return result;
  }

  async rejectReschedule(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId);
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error("Not authorized");
    }
    if (this.user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }
    if (appointment.status !== "RESCHEDULE_REQUESTED") {
      throw new Error("Invalid action for current appointment status");
    }

    const lastActivity = await prisma.appointmentActivity.findFirst({
      where: { appointmentId, newStatus: "RESCHEDULE_REQUESTED" },
      orderBy: { createdAt: "desc" },
    });
    const previousStatus = lastActivity?.previousStatus || "CONFIRMED";

    return prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: previousStatus },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "RESCHEDULE_REJECTED",
          title: "Reagendamento Rejeitado",
          content:
            "A solicitação de reagendamento foi rejeitada pelo administrador.",
          previousStatus: "RESCHEDULE_REQUESTED",
          newStatus: previousStatus,
        },
      });
      return updatedAppointment;
    });
  }

  async reschedule(appointmentId: string, newDate: Date, reason?: string) {
    const appointment = await this.getAppointment(appointmentId);
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error("Not authorized");
    }

    if (this.user.role !== "ADMIN") {
      throw new Error("Forbidden: Only admins can reschedule directly.");
    }

    const previousStatus = appointment.status;
    if (
      previousStatus !== "PENDING_CONFIRMATION" &&
      previousStatus !== "CONFIRMED"
    ) {
      throw new Error("Invalid action for current appointment status");
    }

    const previousDate = appointment.date;

    const result = await prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: "RESCHEDULED",
          date: newDate,
        },
      });

      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "STATUS_CHANGE",
          title: "Agendamento Reagendado",
          content: `O agendamento foi reagendado pelo administrador para ${newDate.toLocaleString()}. ${reason ? `Motivo: ${reason}` : ""
            }`,
          previousStatus: "RESCHEDULE_REQUESTED",
          newStatus: "RESCHEDULED",
        },
      });
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: "STATUS_CHANGE",
          title: "Agendamento Confirmado",
          content: `O agendamento foi confirmado pelo sistema para ${newDate.toLocaleString()}.`,
          previousStatus: "RESCHEDULED",
          newStatus: "CONFIRMED",
        },
      });
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "CONFIRMED" },
      });
      return updatedAppointment;
    });

    // 🔔 DISPATCH NOTIFICATION
    await notifyAppointmentRescheduled(
      appointmentId,
      appointment.deliveryType.organizationId,
      this.user.id,
      previousDate
    );

    return result;
  }
}

