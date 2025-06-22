import { prisma } from "@/lib/prisma";
import { Stepper } from "../../../_component/stepper";
import { DataPageClient } from "./page-client";

export default async function DataPage({
  params,
}: {
  params: Promise<{ omslug: string; deliveryslug: string }>;
}) {
  const { omslug: organizationSlug, deliveryslug: deliverySlug } = await params;

  const deliveryType = await prisma.deliveryType.findUnique({
    where: {
      slug: deliverySlug,
    },
    include: {
      organization: true,
    },
  });

  const deliveryTypeId = deliveryType?.id;
  const organizationName = deliveryType?.organization.name;
  const organizationId = deliveryType?.organization.id;

  if (!organizationId || !deliveryTypeId) {
    return <div>Organização não encontrada</div>;
  }

  return (
    <>
      <DataPageClient
        organizationId={organizationId}
        deliveryTypeId={deliveryTypeId}
        organizationName={organizationName}
      />
    </>
  );
}
