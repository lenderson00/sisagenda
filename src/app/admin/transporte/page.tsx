import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateDeliveryTypeDialog } from "./_components/create-delivery-type-dialog";
import { DeliveryTypesPageClient } from "./page-client";

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
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Tipos de Transporte
              </h1>
              <p className="text-gray-600">
                Gerencie os tipos de transporte disponíveis
              </p>
            </div>
            <CreateDeliveryTypeDialog orgId={orgId} />
          </div>
        </div>
      </div>
      <DeliveryTypesPageClient organizationId={orgId} />
    </>
  );
}
