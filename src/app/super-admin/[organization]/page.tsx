import { PageHeader } from "@/components/page-header";
import { DrawerDialog } from "@/components/ui/dialog-drawer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { IconPlus } from "@tabler/icons-react";
import { notFound } from "next/navigation";
import { AdminForm } from "./_components/admin-form";
import { OrganizationAdminClient } from "./page-client";

export default async function OrganizationAdminPage({
  params,
}: {
  params: Promise<{ organization: string }>;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    return notFound();
  }

  const nextParams = await params;

  const organization = await prisma.organization.findUnique({
    where: {
      id: nextParams.organization,
      deletedAt: null,
    },
    include: {
      militares: {
        where: {
          role: "ADMIN",
        },
      },
    },
  });

  if (!organization) {
    return notFound();
  }

  return (
    <>
      <PageHeader
        title={organization.name}
        subtitle={organization.description || ""}
      >
        {organization.militares && organization.militares.length < 2 && (
          <DrawerDialog
            action="Adicionar Administrador"
            title="Adicionar Administrador"
            description="Adicione um administrador para gerenciar esta organização."
          >
            <AdminForm organizationId={organization.id} />
          </DrawerDialog>
        )}
      </PageHeader>
      <OrganizationAdminClient organization={organization} />
    </>
  );
}
