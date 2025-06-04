import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { DeliveryTypePageClient } from "./page-client";

const DeliveryTypePage = async ({
  params,
}: {
  params: { deliveryTypeId: string };
}) => {
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
      id: params.deliveryTypeId,
      organizationId: orgId,
      deletedAt: null,
    },
  });

  if (!deliveryType) {
    notFound();
  }

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
      <DeliveryTypePageClient deliveryType={deliveryType} />
    </>
  );
};

export default DeliveryTypePage;
