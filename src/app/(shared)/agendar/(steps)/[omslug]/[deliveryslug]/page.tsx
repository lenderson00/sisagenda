import { prisma } from "@/lib/prisma";
import { Stepper } from "../../../_component/stepper";
import { DataPageClient } from "./page-client";

export default async function DataPage({
  params,
}: {
  params: Promise<{ deliveryslug: string }>;
}) {
  const { deliveryslug: deliverySlug } = await params;

  const deliveryType = await prisma.deliveryType.findUnique({
    where: {
      slug: deliverySlug,
    },
    include: {
      organization: true,
    },
  });

  const deliveryTypeId = deliveryType?.id;
  const organizationId = deliveryType?.organization.id;

  if (!organizationId || !deliveryTypeId) {
    return <div>Organização não encontrada</div>;
  }

  return (
    <>
      <DataPageClient
        organizationId={organizationId}
        deliveryTypeId={deliveryTypeId}
      />
    </>
  );
}
