import { Stepper } from "@/app/fornecedor/agendar/_component/stepper";
import OmSelection from "../../_component/om-selection";

const transporteTypes = [
  {
    name: "Transporte",
    description: "Transporte",
    nextStep: "/agendar/om/transporte1",
  },
  {
    name: "Transporte",
    description: "Transporte",
    nextStep: "/agendar/om/transporte2",
  },
  {
    name: "Transporte",
    description: "Transporte",
    nextStep: "/agendar/om/transporte3",
  },
];

export default function AgendarOM() {
  return (
    <>
      <Stepper step={2} totalSteps={3} />
      <div className="w-full flex flex-col">
        {transporteTypes.map((transporteType, index) => (
          <OmSelection
            key={transporteType.name}
            omName={transporteType.name}
            omSigla={transporteType.name}
            omDescription={transporteType.description}
            position={
              index === 0
                ? "top"
                : index === transporteTypes.length - 1
                  ? "bottom"
                  : "middle"
            }
          />
        ))}
      </div>
    </>
  );
}
