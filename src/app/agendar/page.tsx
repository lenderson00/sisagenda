import OmSelection from "./_component/om-selection";
import { Stepper } from "./_component/stepper";

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

const AgendaPage = () => {
	return (
		<div className="flex flex-col items-center justify-start pt-48 h-screen bg-muted">
			<div className="max-w-md w-full flex flex-col gap-4 items-center">
				<h1 className="text-xl font-bold">Agendar</h1>
				<Stepper step={1} totalSteps={3} />
				<div className="w-full flex flex-col">
					{oms.map((om, index) => (
						<OmSelection
							key={om.omSigla}
							omName={om.omName}
							omSigla={om.omSigla}
							omDescription={om.omDescription}
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
			</div>
			<div className=" mt-4 text-sm text-muted-foreground">SisAgenda</div>
		</div>
	);
};

export default AgendaPage;
