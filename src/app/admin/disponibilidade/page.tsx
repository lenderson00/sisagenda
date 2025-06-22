import { IconCalendar } from "@tabler/icons-react";
import { PageHeader } from "../_components/page-header";
import { EmptyScreen } from "../agenda/_components/empty-screen";

export default function DisponibilidadePage() {
  return (
    <>
      <PageHeader
        title="Disponibilidade"
        subtitle="Veja a disponibilidade de horários para cada tipo de evento."
      />
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
