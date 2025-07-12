import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  IconBuilding,
  IconMail,
  IconPhone,
  IconMapPin,
  IconFileText,
} from "@tabler/icons-react";
import { notFound, redirect } from "next/navigation";
import { AppointmentsList } from "./_components/appointments-list";

type SupplierPageProps = {
  params: {
    supplierId: string;
  };
};

export default async function SupplierPage({ params }: SupplierPageProps) {
  const session = await auth();

  if (!session) {
    redirect("/entrar");
  }

  if (session.user.role !== "COMRJ_ADMIN") {
    redirect("/");
  }

  const supplier = await prisma.supplier.findUnique({
    where: {
      id: params.supplierId,
    },
  });

  if (!supplier) {
    notFound();
  }

  return (
    <>
      <PageHeader title={supplier.name} subtitle="Detalhes do fornecedor">
        <Badge variant={supplier.isActive ? "default" : "destructive"}>
          {supplier.isActive ? "Ativo" : "Inativo"}
        </Badge>
      </PageHeader>

      <div className="container mx-auto p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconPhone className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <IconMail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {supplier.email || "Não informado"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <IconPhone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">
                    {supplier.whatsapp || "Não informado"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <IconMapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Endereço</p>
                  <p className="text-sm text-muted-foreground">
                    {supplier.address || "Não informado"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fiscal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconFileText className="h-5 w-5" />
                Informações Fiscais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <IconBuilding className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">CNPJ</p>
                  <p className="text-sm text-muted-foreground">
                    {supplier.cnpj}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <IconFileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant={supplier.isActive ? "default" : "destructive"}
                  >
                    {supplier.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <IconFileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Cadastrado em</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(supplier.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentsList supplierId={supplier.id} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
