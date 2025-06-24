import { prisma } from '@/lib/prisma'
import type { Appointment, AppointmentStatus } from '@prisma/client'
import type { Session } from 'next-auth'

type AppointmentWithRelations = Appointment & {
  deliveryType: {
    organizationId: string
  }
}

export class AppointmentService {
  private user: Session['user']

  constructor(session: Session) {
    if (!session?.user?.id || !session.user.role) {
      throw new Error('User not authenticated')
    }
    this.user = session.user
  }

  private async getAppointment(
    appointmentId: string,
  ): Promise<AppointmentWithRelations | null> {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { deliveryType: true },
    })
    return appointment
  }

  private isUserAuthorized(appointment: AppointmentWithRelations): boolean {
    const userRole = this.user.role
    if (userRole === 'SUPER_ADMIN' || userRole === 'COMIMSUP') {
      return true
    }
    if (userRole === 'FORNECEDOR') {
      return appointment.userId === this.user.id
    }
    if (userRole === 'ADMIN' || userRole === 'USER') {
      return (
        appointment.deliveryType.organizationId === this.user.organizationId
      )
    }
    return false
  }

  async approve(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId)
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error('Not authorized')
    }

    if (this.user.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }

    if (appointment.status !== 'PENDING_CONFIRMATION') {
      throw new Error('Invalid action for current appointment status')
    }

    return prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CONFIRMED' },
      })
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'STATUS_CHANGE',
          title: 'Agendamento Aprovado',
          content: 'O agendamento foi aprovado pelo administrador.',
          previousStatus: 'PENDING_CONFIRMATION',
          newStatus: 'CONFIRMED',
        },
      })
      return updatedAppointment
    })
  }

  async reject(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId)
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error('Not authorized')
    }

    if (this.user.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }

    if (appointment.status !== 'PENDING_CONFIRMATION') {
      throw new Error('Invalid action for current appointment status')
    }

    return prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: 'REJECTED' },
      })
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'STATUS_CHANGE',
          title: 'Agendamento Rejeitado',
          content: 'O agendamento foi rejeitado pelo administrador.',
          previousStatus: 'PENDING_CONFIRMATION',
          newStatus: 'REJECTED',
        },
      })
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'CANCELLED',
          title: 'Agendamento Cancelado',
          content: 'O sistema cancelou o agendamento.',
          previousStatus: 'REJECTED',
          newStatus: 'CANCELLED',
        },
      })
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CANCELLED' },
      })
      return updatedAppointment
    })
  }

  async cancel(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId)
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error('Not authorized')
    }

    if (this.user.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }

    const previousStatus = appointment.status

    return prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CANCELLED' },
      })
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'CANCELLED',
          title: 'Agendamento Cancelado',
          content: 'O agendamento foi cancelado pelo administrador.',
          previousStatus,
          newStatus: 'CANCELLED',
        },
      })
      return updatedAppointment
    })
  }

  async requestCancellation(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId)
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error('Not authorized')
    }

    if (this.user.role !== 'FORNECEDOR') {
      throw new Error('Forbidden')
    }

    const previousStatus = appointment.status
    if (
      previousStatus !== 'PENDING_CONFIRMATION' &&
      previousStatus !== 'CONFIRMED'
    ) {
      throw new Error('Invalid action for current appointment status')
    }

    return prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CANCELLATION_REQUESTED' },
      })
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'STATUS_CHANGE',
          title: 'Solicitação de Cancelamento',
          content: 'O fornecedor solicitou o cancelamento do agendamento.',
          previousStatus,
          newStatus: 'CANCELLATION_REQUESTED',
        },
      })
      return updatedAppointment
    })
  }

  async approveCancellation(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId)
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error('Not authorized')
    }
    if (this.user.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }
    if (appointment.status !== 'CANCELLATION_REQUESTED') {
      throw new Error('Invalid action for current appointment status')
    }

    return prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CANCELLED' },
      })
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'STATUS_CHANGE',
          title: 'Cancelamento Aprovado',
          content:
            'A solicitação de cancelamento foi aprovada pelo administrador.',
          previousStatus: 'CANCELLATION_REQUESTED',
          newStatus: 'CANCELLED',
        },
      })
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'CANCELLED',
          title: 'Cancelamento Aprovado',
          content: 'O agendamento foi cancelado pelo sistema.',
          previousStatus: 'CANCELLATION_REQUESTED',
          newStatus: 'CANCELLED',
        },
      })
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CANCELLED' },
      })
      return updatedAppointment
    })
  }

  async rejectCancellation(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId)
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error('Not authorized')
    }
    if (this.user.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }
    if (appointment.status !== 'CANCELLATION_REQUESTED') {
      throw new Error('Invalid action for current appointment status')
    }

    const lastActivity = await prisma.appointmentActivity.findFirst({
      where: {
        appointmentId,
        newStatus: 'CANCELLATION_REQUESTED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const previousStatus = lastActivity?.previousStatus || 'CONFIRMED'

    return prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: previousStatus },
      })
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'STATUS_CHANGE',
          title: 'Cancelamento Rejeitado',
          content:
            'A solicitação de cancelamento foi rejeitada pelo administrador.',
          previousStatus: 'CANCELLATION_REQUESTED',
          newStatus: previousStatus,
        },
      })

      return updatedAppointment
    })
  }

  async markAsNoShow(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId)
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error('Not authorized')
    }
    if (this.user.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }
    if (
      appointment.status !== 'CONFIRMED' ||
      new Date(appointment.date) >= new Date()
    ) {
      throw new Error('Invalid action for current appointment status or date')
    }

    return prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: 'SUPPLIER_NO_SHOW' },
      })
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'SUPPLIER_NO_SHOW',
          title: 'Fornecedor não compareceu',
          content: 'O administrador marcou que o fornecedor não compareceu.',
          previousStatus: 'CONFIRMED',
          newStatus: 'SUPPLIER_NO_SHOW',
        },
      })
      return updatedAppointment
    })
  }

  async markAsCompleted(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId)
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error('Not authorized')
    }
    if (this.user.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }
    if (
      appointment.status !== 'CONFIRMED' ||
      new Date(appointment.date) >= new Date()
    ) {
      throw new Error('Invalid action for current appointment status or date')
    }

    return prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: 'COMPLETED' },
      })
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'COMPLETED',
          title: 'Agendamento concluído',
          content: 'O agendamento foi marcado como concluído pelo administrador.',
          previousStatus: 'CONFIRMED',
          newStatus: 'COMPLETED',
        },
      })
      return updatedAppointment
    })
  }

  async requestReschedule(
    appointmentId: string,
    newDate: Date,
    reason: string,
  ) {
    const appointment = await this.getAppointment(appointmentId)
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error('Not authorized')
    }

    if (this.user.role !== 'FORNECEDOR') {
      throw new Error('Forbidden')
    }

    const previousStatus = appointment.status
    if (
      previousStatus !== 'PENDING_CONFIRMATION' &&
      previousStatus !== 'CONFIRMED'
    ) {
      throw new Error('Invalid action for current appointment status')
    }

    return prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: 'RESCHEDULE_REQUESTED' },
      })
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'RESCHEDULE_REQUESTED',
          title: 'Solicitação de Reagendamento',
          content: reason,
          metadata: {
            newDate: newDate.toISOString(),
          },
          previousStatus,
          newStatus: 'RESCHEDULE_REQUESTED',
        },
      })

      return updatedAppointment
    })
  }

  async approveReschedule(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId)
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error('Not authorized')
    }
    if (this.user.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }
    if (appointment.status !== 'RESCHEDULE_REQUESTED') {
      throw new Error('Invalid action for current appointment status')
    }

    const lastActivity = await prisma.appointmentActivity.findFirst({
      where: { appointmentId, type: 'RESCHEDULE_REQUESTED' },
      orderBy: { createdAt: 'desc' },
    })

    const newDate = (lastActivity?.metadata as any)?.newDate
    if (!newDate) {
      throw new Error('Could not find new date in reschedule request')
    }

    return prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CONFIRMED', date: new Date(newDate) },
      })
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'RESCHEDULE_CONFIRMED',
          title: 'Reagendamento Aprovado',
          content:
            'A solicitação de reagendamento foi aprovada pelo administrador.',
          previousStatus: 'RESCHEDULE_REQUESTED',
          newStatus: 'CONFIRMED',
        },
      })
      return updatedAppointment
    })
  }

  async rejectReschedule(appointmentId: string) {
    const appointment = await this.getAppointment(appointmentId)
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error('Not authorized')
    }
    if (this.user.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }
    if (appointment.status !== 'RESCHEDULE_REQUESTED') {
      throw new Error('Invalid action for current appointment status')
    }

    const lastActivity = await prisma.appointmentActivity.findFirst({
      where: { appointmentId, newStatus: 'RESCHEDULE_REQUESTED' },
      orderBy: { createdAt: 'desc' },
    })
    const previousStatus = lastActivity?.previousStatus || 'CONFIRMED'

    return prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: previousStatus },
      })
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'RESCHEDULE_REJECTED',
          title: 'Reagendamento Rejeitado',
          content:
            'A solicitação de reagendamento foi rejeitada pelo administrador.',
          previousStatus: 'RESCHEDULE_REQUESTED',
          newStatus: previousStatus,
        },
      })
      return updatedAppointment
    })
  }

  async reschedule(
    appointmentId: string,
    newDate: Date,
    reason?: string,
  ) {
    const appointment = await this.getAppointment(appointmentId)
    if (!appointment || !this.isUserAuthorized(appointment)) {
      throw new Error('Not authorized')
    }

    if (this.user.role !== 'ADMIN') {
      throw new Error('Forbidden: Only admins can reschedule directly.')
    }

    const previousStatus = appointment.status
    if (
      previousStatus !== 'PENDING_CONFIRMATION' &&
      previousStatus !== 'CONFIRMED'
    ) {
      throw new Error('Invalid action for current appointment status')
    }

    return prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: 'RESCHEDULED',
          date: newDate,
        },
      })

      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'STATUS_CHANGE',
          title: 'Agendamento Reagendado',
          content: `O agendamento foi reagendado pelo administrador para ${newDate.toLocaleString()}. ${reason ? `Motivo: ${reason}` : ''
            }`,
          previousStatus,
          newStatus: 'RESCHEDULED',
        },
      })
      await tx.appointmentActivity.create({
        data: {
          appointmentId,
          userId: this.user.id,
          type: 'STATUS_CHANGE',
          title: 'Agendamento Confirmado',
          content: `O agendamento foi confirmado pelo sistema para ${newDate.toLocaleString()}.`,
          previousStatus,
          newStatus: 'CONFIRMED',
        },
      })
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CONFIRMED' },
      })
      return updatedAppointment
    })
  }
}
