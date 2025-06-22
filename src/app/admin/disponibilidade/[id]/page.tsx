import { prisma } from "@/lib/prisma";
import { SchedulePageClient } from "./page-client";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const schedule = await prisma.schedule.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
    },
  });

  if (!schedule) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={schedule.name}
        subtitle="Edite o horário de disponibilidade existente."
        backButton
      />
      <div className="p-4 pt-0">
        <SchedulePageClient />
      </div>
    </div>
  );
}
