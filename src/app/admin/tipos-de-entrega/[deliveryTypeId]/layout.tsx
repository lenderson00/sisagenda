import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SidebarNav } from "./_components/sidebar";
import { PageHeader } from "../../_components/page-header";

const createSidebarNavItems = (deliveryTypeId: string) => {
  return [
    {
      title: "Disponibilidade",
      href: `/transporte/${deliveryTypeId}`,
    },
    {
      title: "Configurações",
      href: `/transporte/${deliveryTypeId}/configuracoes`,
    },
  ];
};

const DeliveryTypeLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ deliveryTypeId: string }>;
}) => {
  const { deliveryTypeId } = await params;
  const sidebarNavItems = createSidebarNavItems(deliveryTypeId);
  const session = await auth();

  if (!session) {
    redirect("/entrar");
  }

  const orgId = session.user.organizationId;

  if (!orgId) {
    redirect("/");
  }

  const deliveryType = await prisma.deliveryType.findFirst({
    where: {
      id: deliveryTypeId,
      organizationId: orgId,
      deletedAt: null,
    },
    include: {
      organization: true,
    },
  });

  if (!deliveryType) {
    notFound();
  }

  return (
    <div>
      <PageHeader title={deliveryType.name} backButton />
      <div className="container mx-auto md:px-6 px-4 md:py-8 py-6">
        <div className="flex flex-col space-y-8 md:flex-row lg:space-x-12 lg:space-y-0 gap-0 md:gap-8">
          <aside className="md:-ml-4 md:w-1/4 w-full md:pr-2">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="w-full md:w-3/4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTypeLayout;
