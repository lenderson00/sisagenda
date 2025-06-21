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
      href: `/tipos-de-entrega/${deliveryTypeId}`,
    },
    {
      title: "Configurações",
      href: `/tipos-de-entrega/${deliveryTypeId}/configuracoes`,
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
    <>
      <PageHeader title={deliveryType.name} backButton />

      <div className="flex gap-4 p-4">
        <aside className="md:w-[220px]">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="w-full md:w-3/4">{children}</div>
      </div>
    </>
  );
};

export default DeliveryTypeLayout;
