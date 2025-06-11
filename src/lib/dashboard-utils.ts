import { AppointmentStatus } from "@prisma/client";
import { endOfDay, format, isWithinInterval, startOfDay, subDays } from "date-fns";

export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  todayAppointments: number;
  weekAppointments: number;
  monthAppointments: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  appointments: number;
  confirmed: number;
  cancelled: number;
}

export const getStatusColor = (status: AppointmentStatus): string => {
  const colors = {
    [AppointmentStatus.PENDING_CONFIRMATION]: "#f59e0b",
    [AppointmentStatus.CONFIRMED]: "#10b981",
    [AppointmentStatus.REJECTED]: "#ef4444",
    [AppointmentStatus.CANCELLATION_REQUESTED]: "#f97316",
    [AppointmentStatus.CANCELLATION_REJECTED]: "#8b5cf6",
    [AppointmentStatus.CANCELLED]: "#ef4444",
    [AppointmentStatus.RESCHEDULE_REQUESTED]: "#06b6d4",
    [AppointmentStatus.RESCHEDULE_CONFIRMED]: "#0ea5e9",
    [AppointmentStatus.RESCHEDULE_REJECTED]: "#ec4899",
    [AppointmentStatus.RESCHEDULED]: "#3b82f6",
    [AppointmentStatus.COMPLETED]: "#22c55e",
    [AppointmentStatus.SUPPLIER_NO_SHOW]: "#dc2626",
  };
  return colors[status] || "#6b7280";
};

export const getStatusLabel = (status: AppointmentStatus): string => {
  const labels = {
    [AppointmentStatus.PENDING_CONFIRMATION]: "Pendente",
    [AppointmentStatus.CONFIRMED]: "Confirmado",
    [AppointmentStatus.REJECTED]: "Rejeitado",
    [AppointmentStatus.CANCELLATION_REQUESTED]: "Cancelamento Solicitado",
    [AppointmentStatus.CANCELLATION_REJECTED]: "Cancelamento Rejeitado",
    [AppointmentStatus.CANCELLED]: "Cancelado",
    [AppointmentStatus.RESCHEDULE_REQUESTED]: "Reagendamento Solicitado",
    [AppointmentStatus.RESCHEDULE_CONFIRMED]: "Reagendamento Confirmado",
    [AppointmentStatus.RESCHEDULE_REJECTED]: "Reagendamento Rejeitado",
    [AppointmentStatus.RESCHEDULED]: "Reagendado",
    [AppointmentStatus.COMPLETED]: "Concluído",
    [AppointmentStatus.SUPPLIER_NO_SHOW]: "Fornecedor Não Compareceu",
  };
  return labels[status] || status;
};

export const generateTimeSeriesData = (appointments: any[], days = 7): TimeSeriesData[] => {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const dayAppointments = appointments.filter(apt =>
      isWithinInterval(new Date(apt.date), { start: dayStart, end: dayEnd })
    );

    data.push({
      date: format(date, 'dd/MM'),
      appointments: dayAppointments.length,
      confirmed: dayAppointments.filter(apt => apt.status === AppointmentStatus.CONFIRMED).length,
      cancelled: dayAppointments.filter(apt =>
        apt.status === AppointmentStatus.CANCELLED ||
        apt.status === AppointmentStatus.REJECTED
      ).length,
    });
  }

  return data;
};

export const calculateStats = (appointments: any[]): DashboardStats => {
  const today = new Date();
  const weekAgo = subDays(today, 7);
  const monthAgo = subDays(today, 30);

  return {
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter(apt => apt.status === AppointmentStatus.PENDING_CONFIRMATION).length,
    confirmedAppointments: appointments.filter(apt => apt.status === AppointmentStatus.CONFIRMED).length,
    completedAppointments: appointments.filter(apt => apt.status === AppointmentStatus.COMPLETED).length,
    cancelledAppointments: appointments.filter(apt =>
      apt.status === AppointmentStatus.CANCELLED ||
      apt.status === AppointmentStatus.REJECTED
    ).length,
    todayAppointments: appointments.filter(apt =>
      isWithinInterval(new Date(apt.date), {
        start: startOfDay(today),
        end: endOfDay(today)
      })
    ).length,
    weekAppointments: appointments.filter(apt =>
      new Date(apt.date) >= weekAgo
    ).length,
    monthAppointments: appointments.filter(apt =>
      new Date(apt.date) >= monthAgo
    ).length,
  };
};
