import { TopBar } from "@/components/top-bar";
import { prisma } from "@/lib/prisma";
import { AppointmentHeader } from "./_component/header";

export default async function AgendamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: {
      id,
    },
    include: {
      deliveryType: true,
      activities: true,
      user: true,
    },
  });

  return (
    <div className="">
      <TopBar className="border-b" />
      <div className="mx-auto mt-4 px-4 container space-y-4 flex gap-4 ">
        <div className="w-full">
          <AppointmentHeader appointment={appointment} />
        </div>
        <div className="w-fit min-w-[350px]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Ações</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
