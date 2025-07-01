import { AppointmentStatusChart } from "@/components/dashboard/appointment-status-chart";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { AppointmentsTimelineChart } from "@/components/dashboard/appointments-timeline-chart";
import { RecentAppointmentsTable } from "@/components/dashboard/recent-appointments-table";
import { StatsCard } from "@/components/dashboard/stats-card";
import { SupplierPerformanceChart } from "@/components/dashboard/supplier-performance-chart";
import { ActivityCalendarComponent } from "@/components/dashboard/activity-calendar";
import { PageHeader } from "@/components/page-header";
import { auth } from "@/lib/auth";
import {
  getDashboardData,
  getDashboardAppointments,
  getOrganizationInfo,
} from "@/lib/services/dashboard-service";
import {
  getYearlyActivity,
  getActivityStats,
} from "@/lib/services/activity-service";
import { Calendar, Clock, Package, Users } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.organizationId) {
    redirect("/organizations");
  }

  const {
    stats,
    timeSeriesData,
    statusDistribution,
    supplierPerformance,
    recentAppointments,
  } = await getDashboardData(session.user.organizationId);

  const appointments = await getDashboardAppointments(
    session.user.organizationId,
  );

  const organization = await getOrganizationInfo(session.user.organizationId);

  // Get activity data for the year
  const activityData = await getYearlyActivity(session.user.organizationId);
  const activityStats = await getActivityStats(session.user.organizationId);

  return (
    <>
      <PageHeader
        title={` Dashboard ${organization?.sigla ? ` - ${organization.sigla}` : ""}`}
        subtitle="Visão geral do sistema"
      />
      <div className="flex flex-col gap-4 px-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Agendamentos de hoje"
            value={stats.todayAppointments}
            icon={Clock}
            description="Agendamentos marcados para hoje"
          />
          <StatsCard
            title="Agendamentos pendentes"
            value={stats.pendingAppointments}
            icon={Calendar}
            description="Agendamentos aguardando confirmação"
          />
          <StatsCard
            title="Taxa de conclusão"
            value={
              stats.totalAppointments > 0
                ? Math.round(
                    (stats.completedAppointments / stats.totalAppointments) *
                      100,
                  )
                : 0
            }
            unit="%"
            icon={Package}
            description="Baseado em todos os agendamentos"
          />
          <StatsCard
            title="Fornecedores ativos"
            value={supplierPerformance.length}
            icon={Users}
            description="Fornecedores com agendamentos"
          />
        </div>

        {/* <div className="w-full">
          <ActivityCalendarComponent
            data={activityData}
            totalActivity={activityStats.totalActivity}
            activeDays={activityStats.activeDays}
            averageActivity={activityStats.averageActivity}
          />
        </div> */}

        <AppointmentsTable
          todayAppointments={appointments.today}
          tomorrowAppointments={appointments.tomorrow}
          weekAppointments={appointments.week}
        />
      </div>
    </>
  );
}
