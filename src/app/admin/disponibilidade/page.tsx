import { IconCalendar } from "@tabler/icons-react";
import { PageHeader } from "../_components/page-header";
import { EmptyScreen } from "../agenda/_components/empty-screen";
import { CreateAvailabilityDialog } from "./_components/create-availability-dialog";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DisponibilidadePage() {
  const session = await auth();

  if (!session || !session.user.organizationId) {
    redirect("/");
  }

  const orgId = session.user.organizationId;

  return (
    <>
      <PageHeader
        title="Disponibilidade"
        subtitle="Veja a disponibilidade de horários para cada tipo de evento."
      >
        <CreateAvailabilityDialog orgId={orgId} />
      </PageHeader>
      <div className="flex-1 space-y-4 p-4 pt-6">
        <EmptyScreen
          Icon={IconCalendar}
          headline="Ainda não tem disponibilidade cadastrada"
          description="Você não possui disponibilidade cadastrada. Assim que alguém cadastrar uma disponibilidade, ela aparecerá aqui."
        />
      </div>
    </>
  );
}
