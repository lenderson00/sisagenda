import { prisma } from "@/lib/prisma";
import { endOfDay, startOfDay, addDays, endOfWeek, startOfWeek } from "date-fns";

export async function getComrjDashboardData() {
  // Get all organizations managed by COMRJ
  const organizations = await prisma.organization.findMany({
    where: {
      role: "DEPOSITO",
      isActive: true,
    },
    select: { id: true },
  });

  const orgIds = organizations.map((org) => org.id);

  // Get basic stats
  const [
    totalOrganizations,
    totalSuppliers,
    futureAppointments,
  ] = await Promise.all([
    prisma.organization.count({
      where: {
        role: "DEPOSITO",
        isActive: true,
      },
    }),
    prisma.supplier.count({
      where: {
        isActive: true,
      },
    }),
    prisma.appointment.count({
      where: {
        organizationId: { in: orgIds },
        date: {
          gte: new Date(),
          lte: addDays(new Date(), 7),
        },
        status: {
          in: ["CONFIRMED", "PENDING_CONFIRMATION"],
        },
      },
    }),
  ]);

  return {
    totalOrganizations,
    totalSuppliers,
    futureAppointments,
  };
}

export async function getComrjDashboardAppointments() {
  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);
  const startOfTomorrow = startOfDay(addDays(today, 1));
  const endOfTomorrow = endOfDay(addDays(today, 1));
  const startOfThisWeek = startOfWeek(today);
  const endOfThisWeek = endOfDay(addDays(today, 7));

  // Get all organizations managed by COMRJ
  const organizations = await prisma.organization.findMany({
    where: {
      role: "DEPOSITO",
      isActive: true,
    },
    select: { id: true },
  });

  const orgIds = organizations.map((org) => org.id);

  const [todayAppointments, tomorrowAppointments, weekAppointments] =
    await Promise.all([
      getAppointmentsByDateRange(orgIds, startOfToday, endOfToday),
      getAppointmentsByDateRange(orgIds, startOfTomorrow, endOfTomorrow),
      getAppointmentsByDateRange(orgIds, startOfThisWeek, endOfThisWeek),
    ]);

  return {
    today: todayAppointments,
    tomorrow: tomorrowAppointments,
    week: weekAppointments,
  };
}

async function getAppointmentsByDateRange(
  organizationIds: string[],
  startDate: Date,
  endDate: Date,
) {
  const appointments = await prisma.appointment.findMany({
    where: {
      organizationId: { in: organizationIds },
      date: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        in: ["CONFIRMED", "RESCHEDULE_CONFIRMED"],
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      Supplier: {
        select: {
          id: true,
          name: true,
        },
      },
      organization: {
        select: {
          id: true,
          name: true,
          sigla: true,
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
      date: "asc",
    },
  });

  // Map appointments to ensure consistent user field structure
  return appointments.map((appointment) => ({
    ...appointment,
    user: {
      id: appointment.user?.id || appointment.Supplier?.id || "",
      name: appointment.user?.name || appointment.Supplier?.name || null,
    },
    requesterName: appointment.user?.name || appointment.Supplier?.name || "N/A",
  }));
}
