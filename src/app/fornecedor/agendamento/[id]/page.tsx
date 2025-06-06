import { prisma } from "@/lib/prisma";

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
    },
  });

  return <div>AgendamentoPage {JSON.stringify(appointment)}</div>;
}
