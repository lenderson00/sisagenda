import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  IconBuilding,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconFileText,
  IconCalendar,
  IconTruck,
} from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { AppointmentsTable } from "./_components/appointments-table";
import { DeliveryTypesList } from "./_components/delivery-types-list";

type OrganizationPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case "COMRJ":
      return <IconBuildingStore className="h-5 w-5" />;
    case "DEPOSITO":
      return <IconBuildingWarehouse className="h-5 w-5" />;
    case "COMIMSUP":
      return <IconBuilding className="h-5 w-5" />;
    default:
      return <IconBuilding className="h-5 w-5" />;
  }
};

const getRoleBadge = (role: string) => {
  const roleMap: Record<
    string,
    { variant: "default" | "secondary" | "outline"; label: string }
  > = {
    COMRJ: { variant: "default", label: "COMRJ" },
    DEPOSITO: { variant: "secondary", label: "Depósito" },
    COMIMSUP: { variant: "outline", label: "COMIMSUP" },
  };

  const roleInfo = roleMap[role] || {
    variant: "outline" as const,
    label: role,
  };
  return (
    <Badge variant={roleInfo.variant} className="flex items-center gap-1">
      {getRoleIcon(role)}
      {roleInfo.label}
    </Badge>
  );
};

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const session = await auth();

  if (!session) {
    redirect("/entrar");
  }

  if (session.user.role !== "COMRJ_ADMIN") {
    redirect("/");
  }

  const { organizationId } = await params;
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });

  if (!organization) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={organization.name}
        subtitle={organization.description || "Detalhes da organização"}
      >
        <div className="flex items-center gap-2">
          {getRoleBadge(organization.role)}
          <Badge variant={organization.isActive ? "default" : "destructive"}>
            {organization.isActive ? "Ativa" : "Inativa"}
          </Badge>
        </div>
      </PageHeader>

      <div className="container mx-auto p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Organization Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconFileText className="h-5 w-5" />
                Informações da Organização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <IconBuilding className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Sigla</p>
                  <p className="text-sm text-muted-foreground">
                    {organization.sigla}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <IconFileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tipo</p>
                  {getRoleBadge(organization.role)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <IconFileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant={organization.isActive ? "default" : "destructive"}
                  >
                    {organization.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <IconFileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Cadastrada em</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(organization.createdAt).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lunch Time Configuration Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendar className="h-5 w-5" />
                Configurações de Horário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <IconCalendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Horário de Almoço</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(organization.lunchTimeStart / 60)
                      .toString()
                      .padStart(2, "0")}
                    :
                    {(organization.lunchTimeStart % 60)
                      .toString()
                      .padStart(2, "0")}{" "}
                    -
                    {Math.floor(organization.lunchTimeEnd / 60)
                      .toString()
                      .padStart(2, "0")}
                    :
                    {(organization.lunchTimeEnd % 60)
                      .toString()
                      .padStart(2, "0")}
                  </p>
                </div>
              </div>

              {organization.description && (
                <div className="flex items-center gap-3">
                  <IconFileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Descrição</p>
                    <p className="text-sm text-muted-foreground">
                      {organization.description}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Appointments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCalendar className="h-5 w-5" />
              Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentsTable organizationId={organization.id} />
          </CardContent>
        </Card>

        {/* Delivery Types Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconTruck className="h-5 w-5" />
              Tipos de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryTypesList
              organizationId={organization.id}
              organizationSigla={organization.sigla}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
