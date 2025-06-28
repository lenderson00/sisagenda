import { PageHeader } from "@/components/page-header";
import type { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { PageClient } from "./page-client";

type Params = {
  slug: string[];
};

const AvailableTabs = [
  {
    label: "Pendentes de ação",
    href: "/agenda",
    slug: "pendentes",
  },
  {
    label: "Próximos",
    href: "/agenda/proximos",
    slug: "proximos",
  },
  {
    label: "Cancelados",
    href: "/agenda/cancelados",
    slug: "cancelados",
  },
  {
    label: "Anteriores",
    href: "/agenda/anteriores",
    slug: "anteriores",
  },
  {
    label: "Concluídos",
    href: "/agenda/concluidos",
    slug: "concluidos",
  },
];

const buildWhere = (tab: string): Prisma.AppointmentWhereInput => {
  switch (tab) {
    case "pendentes":
      return {
        date: {
          gte: new Date(),
        },
        status: {
          in: ["PENDING_CONFIRMATION", "RESCHEDULE_REQUESTED"],
        },
      };
    case "proximos":
      return {
        date: { gte: new Date() },
        status: { in: ["CONFIRMED", "RESCHEDULE_CONFIRMED"] },
      };
    case "anteriores":
      return { date: { lt: new Date() }, status: { notIn: ["COMPLETED"] } };
    case "cancelados":
      return { status: "CANCELLED" };
    case "concluidos":
      return { status: "COMPLETED" };
    default:
      return {
        date: { gte: new Date() },
        status: { in: ["CONFIRMED", "RESCHEDULE_CONFIRMED"] },
      };
  }
};

const AgendamentosPage = async ({ params }: { params: Promise<Params> }) => {
  const { slug } = await params;

  if (
    Array.isArray(slug) &&
    slug.length > 0 &&
    !AvailableTabs.some((availableTab) => availableTab.slug === slug[0])
  ) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Reservas"
        subtitle="Veja os eventos futuros e passados reservados através dos links de tipos de eventos."
      />
      <PageClient slug={slug} />
    </>
  );
};

export default AgendamentosPage;
