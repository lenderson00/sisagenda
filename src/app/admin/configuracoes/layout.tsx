import { PageHeader } from "@/components/page-header";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { SidebarNav } from "./_components/sidebar";

const createSidebarNavItems = () => {
  return [
    {
      title: "Geral",
      href: `/configuracoes`,
    },
    {
      title: "Avançado",
      href: `/configuracoes/avancado`,
    },
  ];
};

const ConfiguracoesLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const sidebarNavItems = createSidebarNavItems();
  const session = await auth();

  if (!session) {
    redirect("/entrar");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const orgId = session.user.organizationId;

  if (!orgId) {
    redirect("/");
  }

  const organization = await prisma.organization.findFirst({
    where: {
      id: orgId,
      deletedAt: null,
    },
  });

  if (!organization) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Configurações"
        subtitle="Gerencie as configurações da sua organização"
        backButton
      />

      <div className="flex gap-4 p-4 flex-col md:flex-row">
        <aside className="md:w-[220px]">
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

export default ConfiguracoesLayout;
