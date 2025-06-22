import { IconCalendar } from "@tabler/icons-react";
import { PageHeader } from "../../_components/page-header";
import { EmptyScreen } from "../../agenda/_components/empty-screen";
import { CreateAvailabilityDialog } from "./_components/create-availability-dialog";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DisponibilidadePage() {
  const session = await auth();

  if (!session || !session.user.organizationId) {
    redirect("/");
  }

  const orgId = session.user.organizationId;

  const schedules = await prisma.schedule.findMany({
    where: {
      organizationId: orgId,
    },
  });

  return (
    <>
      <PageHeader
        title="Disponibilidade"
        subtitle="Veja a disponibilidade de horários para cada tipo de evento."
      >
        <CreateAvailabilityDialog orgId={orgId} />
      </PageHeader>
      <div className="flex-1 space-y-4 p-4 pt-6">
        {schedules.length === 0 ? (
          <EmptyScreen
            Icon={IconCalendar}
            headline="Ainda não tem disponibilidade cadastrada"
            description="Você não possui disponibilidade cadastrada. Assim que alguém cadastrar uma disponibilidade, ela aparecerá aqui."
          />
        ) : (
          <div>
            {schedules.map((schedule) => (
              <div key={schedule.id}>
                <Link href={`/admin/disponibilidade/${schedule.id}`}>
                  {schedule.name}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
