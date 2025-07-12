import { PageHeader } from "@/components/page-header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OrganizationsPageClient } from "./page-client";

export default async function DepositosPage() {
  const session = await auth();

  if (!session) {
    redirect("/entrar");
  }

  if (session.user.role !== "COMRJ_ADMIN") {
    redirect("/");
  }

  const orgId = session.user.organizationId;

  if (!orgId) {
    redirect("/");
  }

  return (
    <>
      <PageHeader
        title="Depósitos"
        subtitle="Visualize os depósitos e suas estatísticas de agendamentos"
      />
      <OrganizationsPageClient />
    </>
  );
}
