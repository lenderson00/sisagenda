import { prisma } from "@/lib/prisma";
import { SchedulePageClient } from "./page-client";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

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
