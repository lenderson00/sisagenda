import { prisma } from "@/lib/prisma";
import OmSelection from "../../_component/om-selection";
import { Stepper } from "../../_component/stepper";
import { EmptyScreen } from "@/app/admin/agenda/_components/empty-screen";
import { IconBuildingCommunity } from "@tabler/icons-react";

const AgendarOM = async () => {
  const oms = await prisma.organization.findMany({
    where: {
      isActive: true,
      deletedAt: null,
      role: "DEPOSITO",
    },
    orderBy: {
      name: "asc",
    },
  });

  if (oms.length === 0) {
    return (
      <EmptyScreen
        Icon={IconBuildingCommunity}
        headline="Nenhuma OM encontrada"
        description="Ainda não há OM cadastradas. Assim que uma OM for cadastrada, ela aparecerá aqui."
      />
    );
  }

  return (
    <>
      <div className="w-full flex flex-col">
        {oms.map((om, index) => (
          <OmSelection
            key={`${om.id}-${index}`}
            omName={om.name}
            omSigla={om.sigla}
            omDescription={om.description ?? ""}
            position={
              index === 0
                ? "top"
                : index === oms.length - 1
                  ? "bottom"
                  : "middle"
            }
            unique={oms.length === 1}
          />
        ))}
      </div>
    </>
  );
};

export default AgendarOM;
