import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SidebarNav } from "./_components/sidebar";
import { PageHeader } from "../../_components/page-header";

const createSidebarNavItems = (scheduleId: string) => {
  return [
    {
      title: "Configurações da Entrega",
      href: `/disponibilidade/${scheduleId}`,
    },
    {
      title: "Sobescrever Datas Disponíveis",
      href: `/disponibilidade/${scheduleId}/sobescrever-datas`,
    },
  ];
};

const DeliveryTypeLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const sidebarNavItems = createSidebarNavItems(id);
  const session = await auth();

  if (!session) {
    redirect("/entrar");
  }

  const orgId = session.user.organizationId;

  if (!orgId) {
    redirect("/");
  }

  const schedule = await prisma.schedule.findFirst({
    where: {
      id,
      organizationId: orgId,
      deletedAt: null,
    },
    include: {
      organization: true,
      availability: true,
    },
  });

  if (!schedule) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={schedule.name}
        backButton
        subtitle="Edite o horário de disponibilidade existente."
      />

      <div className="flex gap-4 p-4">
        <aside className="md:w-[220px] ">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="w-full md:w-3/4">
          {children}
          <div className="flex justify-center items-center mt-16 mb-4">
            <p className="text-sm text-gray-500">
              SisAgenda. Grupo X - MPI CIANB - 2025
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryTypeLayout;
