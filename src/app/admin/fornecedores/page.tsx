import { PageHeader } from "@/components/page-header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SearchSupplierDialog } from "./_components/search-supplier-dialog";
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
      <PageHeader
        title="Fornecedores"
        subtitle="Gerencie os fornecedores e suas informações"
      >
        <SearchSupplierDialog orgId={orgId} />
      </PageHeader>
      <SuppliersPageClient organizationId={orgId} />
    </>
  );
}
