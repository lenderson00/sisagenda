import { calculateStats, generateTimeSeriesData } from "@/lib/dashboard-utils";
import { prisma } from "@/lib/prisma";
import { ActivityType, AppointmentStatus, UserRole } from "@prisma/client";
import { endOfDay, endOfWeek, startOfWeek } from "date-fns";
import { addDays } from "date-fns";
import { startOfDay } from "date-fns";

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
  const suppliers = await prisma.supplier.findMany({
    where: {
      isActive: true,
      deletedAt: null,
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

async function getConfirmedAppointmentsByDateRange(
  organizationId: string,
  startDate: Date,
  endDate: Date,
) {
  const appointments = await prisma.appointment.findMany({
    where: {
      organizationId,
      status: AppointmentStatus.CONFIRMED,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      user: { select: { name: true } },
      deliveryType: { select: { name: true } },
      activities: {
        where: {
          type: ActivityType.CREATED,
        },
        select: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return appointments.map((apt) => ({
    ...apt,
    requesterName: apt.activities[0]?.user?.name ?? "N/A",
  }));
}

// Get appointments for dashboard table
export async function getDashboardAppointments(organizationId: string) {
  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);
  const startOfTomorrow = startOfDay(addDays(today, 1));
  const endOfTomorrow = endOfDay(addDays(today, 1));
  const startOfThisWeek = startOfWeek(today);
  const endOfThisWeek = endOfDay(addDays(today, 7));

  const [todayAppointments, tomorrowAppointments, weekAppointments] =
    await Promise.all([
      getConfirmedAppointmentsByDateRange(
        organizationId,
        startOfToday,
        endOfToday,
      ),
      getConfirmedAppointmentsByDateRange(
        organizationId,
        startOfTomorrow,
        endOfTomorrow,
      ),
      getConfirmedAppointmentsByDateRange(
        organizationId,
        startOfThisWeek,
        endOfThisWeek,
      ),
    ]);

  return {
    today: todayAppointments,
    tomorrow: tomorrowAppointments,
    week: weekAppointments,
  };
}

// Export all functions for dashboard
