import { prisma } from "@/lib/prisma";
import OmSelection from "../../_component/om-selection";
import { Stepper } from "../../_component/stepper";
const oms = [
	{
		omName: "OM 1",
		omSigla: "om-1",
		omDescription: "OM 1",
	},
	{
		omName: "OM 2",
		omSigla: "om-2",
		omDescription: "OM 2",
	},
	{
		omName: "OM 3",
		omSigla: "om-3",
		omDescription: "OM 3",
	},
	{
		omName: "OM 4",
		omSigla: "om-4",
		omDescription: "OM 4",
	},
];

const AgendaPage = async () => {
	const oms = await prisma.oM.findMany({
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
						key={`${om.id}`}
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

export default AgendaPage;
