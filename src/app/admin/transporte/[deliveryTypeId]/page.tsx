import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { DeliveryTypePageClient } from "./page-client";

const DeliveryTypePage = async ({
  params,
}: {
  params: Promise<{ deliveryTypeId: string }>;
}) => {
  const { deliveryTypeId } = await params;
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

  const mappedDeliveryType = {
    ...deliveryType,
    organization: deliveryType.organization.name,
    organizationId: deliveryType.organizationId,
    createdAt: deliveryType.createdAt.toISOString(),
    updatedAt: deliveryType.updatedAt.toISOString(),
    deletedAt: deliveryType.deletedAt?.toISOString() || null,
  };

  return (
    <>
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
      <DeliveryTypePageClient deliveryType={mappedDeliveryType} />
    </>
  );
};

export default DeliveryTypePage;
