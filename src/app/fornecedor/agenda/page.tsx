import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AgendaPageClient } from "./page-client";

export type AppointmentWithRelations = {
  id: string;
  ordemDeCompra: string;
  date: Date;
  status: string;
  deliveryType: {
    name: string;
  };
  activities: any[];
  organization?: {
    name: string;
  };
};

export default async function AgendaPage() {
  const session = await auth();

  if (!session) {
    redirect("/entrar");
  }

  if (session.user.role !== "FORNECEDOR") {
    redirect("/");
  }

  const orgId = session.user.organizationId;

  if (!orgId) {
    redirect("/");
  }

  return (
    <>
      <AgendaPageClient organizationId={orgId} />
    </>
  );
}
