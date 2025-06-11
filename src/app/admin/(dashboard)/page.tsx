import { AppointmentStatusChart } from "@/components/dashboard/appointment-status-chart";
import { AppointmentsTimelineChart } from "@/components/dashboard/appointments-timeline-chart";
import { RecentAppointmentsTable } from "@/components/dashboard/recent-appointments-table";
import { StatsCard } from "@/components/dashboard/stats-card";
import { SupplierPerformanceChart } from "@/components/dashboard/supplier-performance-chart";
import { auth } from "@/lib/auth";
import {
  getDashboardData,
  getOrganizationInfo,
} from "@/lib/services/dashboard-service";
import { Calendar, Clock, Package, Users } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.organizationId) {
    redirect("/admin/organizations");
  }

  const {
    stats,
    timeSeriesData,
    statusDistribution,
    supplierPerformance,
    recentAppointments,
  } = await getDashboardData(session.user.organizationId);

  const organization = await getOrganizationInfo(session.user.organizationId);

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back to your organization dashboard
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={Calendar}
          description="All time appointments"
        />
        <StatsCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={Clock}
          description="Appointments scheduled for today"
        />
        <StatsCard
          title="Active Suppliers"
          value={supplierPerformance.length}
          icon={Users}
          description="Suppliers with appointments"
        />
        <StatsCard
          title="Delivery Types"
          value={
            stats.totalAppointments > 0
              ? Math.round(
                  (stats.completedAppointments / stats.totalAppointments) * 100,
                )
              : 0
          }
          icon={Package}
          description="Completion rate"
          trend={{
            value: 12,
            isPositive: true,
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AppointmentsTimelineChart
          data={timeSeriesData}
          className="lg:col-span-2"
        />
        <AppointmentStatusChart
          data={statusDistribution}
          className="lg:col-span-1"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SupplierPerformanceChart
          data={supplierPerformance}
          className="lg:col-span-1"
        />
        <RecentAppointmentsTable
          appointments={recentAppointments}
          className="lg:col-span-2"
        />
      </div>
    </div>
  );
}
