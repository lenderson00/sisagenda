import { calculateStats, generateTimeSeriesData } from "@/lib/dashboard-utils";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus, UserRole } from "@prisma/client";

export async function getDashboardData(organizationId: string) {
  // Fetch appointments for the organization
  const appointments = await prisma.appointment.findMany({
    where: {
      organizationId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      deliveryType: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate basic stats
  const stats = calculateStats(appointments);

  // Generate time series data
  const timeSeriesData = generateTimeSeriesData(appointments, 7);

  // Calculate status distribution
  const statusDistribution = Object.values(AppointmentStatus)
    .map((status) => ({
      status,
      count: appointments.filter((apt) => apt.status === status).length,
    }))
    .filter((item) => item.count > 0);

  // Calculate supplier performance
  const supplierPerformance = await getSupplierPerformance(organizationId);

  // Get recent appointments (last 10)
  const recentAppointments = appointments.slice(0, 10);

  return {
    stats,
    timeSeriesData,
    statusDistribution,
    supplierPerformance,
    recentAppointments,
  };
}

export async function getSupplierPerformance(organizationId: string) {
  const suppliers = await prisma.user.findMany({
    where: {
      organizationId,
      isActive: true,
      role: UserRole.FORNECEDOR,
    },
    include: {
      appointments: {
        select: {
          status: true,
        },
      },
    },
  });

  return suppliers
    .map((supplier) => {
      const totalAppointments = supplier.appointments.length;
      const completedAppointments = supplier.appointments.filter(
        (apt) => apt.status === AppointmentStatus.COMPLETED,
      ).length;
      const cancelledAppointments = supplier.appointments.filter(
        (apt) =>
          apt.status === AppointmentStatus.CANCELLED ||
          apt.status === AppointmentStatus.REJECTED,
      ).length;
      const completionRate =
        totalAppointments > 0
          ? (completedAppointments / totalAppointments) * 100
          : 0;

      return {
        name: supplier.name || "Unnamed Supplier",
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        completionRate: Math.round(completionRate),
      };
    })
    .filter((supplier) => supplier.totalAppointments > 0);
}

export async function getOrganizationInfo(organizationId: string) {
  return await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    select: {
      id: true,
      name: true,
      sigla: true,
      description: true,
      isActive: true,
    },
  });
}
