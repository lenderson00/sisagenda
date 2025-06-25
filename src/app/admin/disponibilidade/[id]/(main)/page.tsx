import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { IconPlus } from "@tabler/icons-react";
import { notFound } from "next/navigation";
import { SchedulePageClient } from "./page-client";

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

  return <SchedulePageClient />;
}
