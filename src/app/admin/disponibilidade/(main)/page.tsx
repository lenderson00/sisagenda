import { IconCalendar, IconDots, IconPencil } from "@tabler/icons-react";
import { PageHeader } from "../../_components/page-header";
import { EmptyScreen } from "../../agenda/[[...slug]]/_components/empty-screen";
import { CreateAvailabilityDialog } from "./_components/create-availability-dialog";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          <div className="border rounded-lg divide-y">
            {schedules.map((schedule) => (
              <Link
                key={schedule.id}
                href={`/disponibilidade/${schedule.id}`}
                className="flex justify-between items-center hover:bg-accent"
              >
                <div className="flex items-center gap-2 p-4  cursor-pointer">
                  <IconCalendar />
                  {schedule.name}
                </div>
                <div className="flex items-center gap-2 p-4">
                  <Button variant="outline" size="icon">
                    <IconDots className="w-4 h-4" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
