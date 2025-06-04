import { prisma } from "@/lib/prisma";
import { Stepper } from "../../../_component/stepper";
import { DataPageClient } from "./page-client";

export default async function DataPage({
  params,
}: {
  params: Promise<{ organizationId: string; delivery: string }>;
}) {
  const { organizationId, delivery } = await params;

  const deliveryType = await prisma.deliveryType.findUnique({
    where: {
      id: delivery,
    },
    include: {
      organization: true,
    },
  });

  const deliveryTypeId = delivery;
  const organizationName = deliveryType?.organization.name;

  return (
    <>
      <Stepper step={4} totalSteps={5} />
      <DataPageClient
        organizationId={organizationId}
        deliveryTypeId={deliveryTypeId}
        organizationName={organizationName}
      />
    </>
  );
}
