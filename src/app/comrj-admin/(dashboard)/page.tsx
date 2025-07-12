import { PageHeader } from "@/components/page-header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconBuildingCommunity,
  IconUsers,
  IconCalendar,
} from "@tabler/icons-react";

export default async function ComrjDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/entrar");
  }

  if (session.user.role !== "COMRJ_ADMIN") {
    redirect("/");
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral das suas organizações e atividades"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Organizações Gerenciadas
            </CardTitle>
            <IconBuildingCommunity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">
              Total de organizações
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Fornecedores
            </CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">
              Total de fornecedores cadastrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agendamentos Futuros
            </CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Agendamentos para os próximos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
