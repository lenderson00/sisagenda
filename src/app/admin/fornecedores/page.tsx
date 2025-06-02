import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateSupplierDialog } from "./_components/create-supplier-dialog";
import { SuppliersPageClient } from "./page-client";

export default async function SuppliersPage() {
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
      <div className="border-b ">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Fornecedores
              </h1>
              <p className="text-gray-600">
                Gerencie os fornecedores e suas informações
              </p>
            </div>
            <CreateSupplierDialog orgId={orgId} />
          </div>
        </div>
      </div>
      <SuppliersPageClient organizationId={orgId} />
    </>
  );
}
