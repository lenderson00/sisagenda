import { PageHeader } from "@/components/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Building2, Users, Calendar } from "lucide-react";
import {
  getComrjDashboardData,
  getComrjDashboardAppointments,
} from "@/lib/services/comrj-dashboard-service";

export default async function ComrjDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/entrar");
  }

  if (session.user.role !== "COMRJ_ADMIN") {
    redirect("/");
  }

  const { totalOrganizations, totalSuppliers, futureAppointments } =
    await getComrjDashboardData();
  const appointments = await getComrjDashboardAppointments();

  return (
    <>
      <PageHeader
        title="Dashboard COMRJ"
        subtitle="Visão geral das suas organizações e atividades"
      />
      <div className="flex flex-col gap-4 px-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Organizações Gerenciadas"
            value={totalOrganizations}
            icon={Building2}
            description="Total de organizações"
          />
          <StatsCard
            title="Total de Fornecedores"
            value={totalSuppliers}
            icon={Users}
            description="Total de fornecedores cadastrados"
          />
          <StatsCard
            title="Agendamentos Futuros"
            value={futureAppointments}
            icon={Calendar}
            description="Agendamentos para os próximos 7 dias"
          />
        </div>

        <AppointmentsTable
          todayAppointments={appointments.today}
          tomorrowAppointments={appointments.tomorrow}
          weekAppointments={appointments.week}
        />
      </div>
    </>
  );
}
