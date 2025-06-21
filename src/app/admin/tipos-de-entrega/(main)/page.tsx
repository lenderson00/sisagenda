import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateDeliveryTypeDialog } from "./_components/create-delivery-type-dialog";
import { DeliveryTypesPageClient } from "./page-client";
import { PageHeader } from "../../_components/page-header";

export default async function TransportPage() {
  const session = await auth();

  if (!session) {
    redirect("/entrar");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const orgId = session.user.organizationId;

  if (!orgId) {
    redirect("/");
  }

  return (
    <>
      <PageHeader
        title="Tipos de Entrega"
        subtitle="Gerencie os tipos de entrega para o seu negócio."
      >
        <CreateDeliveryTypeDialog orgId={orgId} />
      </PageHeader>
      <div className="p-4">
        <DeliveryTypesPageClient organizationId={orgId} />
      </div>
    </>
  );
}
