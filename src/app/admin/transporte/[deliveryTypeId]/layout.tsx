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
      <div className="container mx-auto px-6 py-8">
        <div className="flex space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 gap-4">
          <aside className="-ml-4 w-1/4 pr-2">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="w-3/4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTypeLayout;
