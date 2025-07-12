import { PageHeader } from "@/components/page-header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SuppliersPageClient } from "./page-client";
import { RegisterSupplierDialog } from "./_components/register-supplier-dialog";

export default async function FornecedoresPage() {
  const session = await auth();

  if (!session) {
    redirect("/entrar");
  }

  if (session.user.role !== "COMRJ_ADMIN") {
    redirect("/");
  }

  return (
    <>
      <PageHeader
        title="Fornecedores"
        subtitle="Gerencie os fornecedores e suas informações"
      >
        <RegisterSupplierDialog />
      </PageHeader>
      <SuppliersPageClient />
    </>
  );
}
