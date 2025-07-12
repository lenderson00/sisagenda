import { auth } from "@/lib/auth";
import { calculateStats, getStatusLabel } from "@/lib/dashboard-utils";
import { prisma } from "@/lib/prisma";
import type { AppointmentStatus } from "@prisma/client";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import DashboardClient from "./_components/dashboard-client";

function getYearsRange(startYear: number): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i,
  );
}

async function getSupplierDashboard(supplierId: string, year: number) {
  // Fetch supplier info
  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
    select: {
      id: true,
      name: true,
      email: true,
      whatsapp: true,
      cnpj: true,
      address: true,
      createdAt: true,
    },
  });

  // Fetch all appointments for this supplier in the selected year
  const appointments = await prisma.appointment.findMany({
    where: {
      supplierId,
      date: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lte: new Date(`${year}-12-31T23:59:59.999Z`),
      },
    },
    include: {
      deliveryType: { select: { name: true } },
      organization: { select: { name: true } },
    },
    orderBy: { date: "desc" },
  });

  // Stats
  const stats = calculateStats(appointments);

  // Activity calendar data
  const activityData = appointments.reduce(
    (acc, apt) => {
      const date = format(new Date(apt.date), "yyyy-MM-dd");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Convert to activity format and ensure we have at least one entry
  let activity = Object.entries(activityData).map(([date, count]) => ({
    date,
    count,
    level: Math.min(count, 4), // Ensure level is between 0-4 for react-activity-calendar
  }));

  // If no appointments, create a dummy entry for today to prevent empty data error
  if (activity.length === 0) {
    const today = format(new Date(), "yyyy-MM-dd");
    activity = [
      {
        date: today,
        count: 0,
        level: 0,
      },
    ];
  }

  // Pie chart data by status
  const statusCounts: Record<string, number> = {};
  for (const apt of appointments) {
    statusCounts[apt.status] = (statusCounts[apt.status] || 0) + 1;
  }
  const pieData = Object.entries(statusCounts).map(([status, value]) => ({
    name: getStatusLabel(status as AppointmentStatus),
    value,
  }));

  // Bar chart data by month
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const barData = months.map((month) => {
    const monthStr = month.toString().padStart(2, "0");
    const count = appointments.filter(
      (apt) => format(new Date(apt.date), "MM") === monthStr,
    ).length;
    return { month: format(new Date(`${year}-${monthStr}-01`), "MMM"), count };
  });

  return { user: supplier, appointments, stats, activity, pieData, barData };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "FORNECEDOR") {
    redirect("/entrar");
  }

  // Get supplier info for years
  const supplier = await prisma.supplier.findUnique({
    where: { id: session.user.id },
    select: { createdAt: true },
  });

  const searchParamsResolved = await searchParams;
  const startYear = supplier?.createdAt
    ? new Date(supplier.createdAt).getFullYear()
    : new Date().getFullYear();
  const years = getYearsRange(startYear);
  const selectedYear = searchParamsResolved?.year
    ? Number.parseInt(searchParamsResolved.year)
    : years[years.length - 1];

  const {
    user: supplierData,
    appointments,
    stats,
    activity,
    pieData,
    barData,
  } = await getSupplierDashboard(session.user.id, selectedYear);

  return (
    <DashboardClient
      supplier={supplierData}
      appointments={appointments}
      stats={stats}
      activity={activity}
      pieData={pieData}
      barData={barData}
      years={years}
      selectedYear={selectedYear}
    />
  );
}
