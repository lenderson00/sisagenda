import { prisma } from "@/lib/prisma";
import OmSelection from "../../_component/om-selection";
import { Stepper } from "../../_component/stepper";

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
    return <div>Nenhuma OM encontrada</div>;
  }

  return (
    <>
      <Stepper step={1} totalSteps={3} />
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
          />
        ))}
      </div>
    </>
  );
};

export default AgendarOM;
