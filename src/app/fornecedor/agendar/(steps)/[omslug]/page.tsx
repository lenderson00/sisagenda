import { Stepper } from "@/app/fornecedor/agendar/_component/stepper";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DeliveryTypeSelection from "../../_component/delivery-type-selection";

export default async function AgendarOM({
  params,
}: {
  params: { omslug: string };
}) {
  const session = await auth();

  if (!session || session.user.role !== "FORNECEDOR") {
    redirect("/");
  }

  const { omslug: omSlug } = params;

  if (!omSlug) {
    console.log("OM slug is required");
    return;
  }

  const organization = await prisma.organization.findFirst({
    where: {
      sigla: omSlug,
      deletedAt: null,
    },
    select: {
      id: true,
      sigla: true,
      name: true,
      deliveryTypes: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
        },
      },
    },
  });

  if (!organization) {
    console.log("Organization not found");
    return;
  }

  return (
    <>
      <Stepper step={2} totalSteps={3} />
      <div className="w-full flex flex-col">
        {organization.deliveryTypes.map((deliveryType, index) => (
          <DeliveryTypeSelection
            key={deliveryType.id}
            deliveryTypeSlug={deliveryType.slug}
            name={deliveryType.name}
            description={deliveryType.description ?? ""}
            organizationSlug={organization.sigla}
            position={
              index === 0
                ? "top"
                : index === organization.deliveryTypes.length - 1
                  ? "bottom"
                  : "middle"
            }
            unique={organization.deliveryTypes.length === 1}
          />
        ))}
      </div>
    </>
  );
}
