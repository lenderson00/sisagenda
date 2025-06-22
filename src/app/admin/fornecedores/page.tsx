import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateSupplierDialog } from "./_components/create-supplier-dialog";
import { SuppliersPageClient } from "./page-client";
import { PageHeader } from "../_components/page-header";

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
      <PageHeader
        title="Fornecedores"
        subtitle="Gerencie os fornecedores e suas informações"
      >
        <CreateSupplierDialog orgId={orgId} />
      </PageHeader>
      <SuppliersPageClient organizationId={orgId} />
    </>
  );
}
