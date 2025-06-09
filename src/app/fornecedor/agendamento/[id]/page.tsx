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
    <div>
      <AppointmentHeader appointment={appointment} />
    </div>
  );
}
