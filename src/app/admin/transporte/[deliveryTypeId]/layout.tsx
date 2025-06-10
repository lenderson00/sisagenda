import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SidebarNav } from "./_components/sidebar";

const createSidebarNavItems = (deliveryTypeId: string) => {
  return [
    {
      title: "Disponibilidade",
      href: `/admin/transporte/${deliveryTypeId}`,
    },
    {
      title: "Regras de Disponibilidade",
      href: `/admin/transporte/${deliveryTypeId}/regras-de-disponibilidade`,
    },
    {
      title: "Configurações",
      href: `/admin/transporte/${deliveryTypeId}/configuracoes`,
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
      {" "}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {deliveryType.name}
              </h1>
              <p className="text-gray-600">{deliveryType.description}</p>
            </div>
          </div>
        </div>
      </div>
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
