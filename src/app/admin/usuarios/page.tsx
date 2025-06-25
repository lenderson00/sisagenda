import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateUserDialog } from "./_components/create-user-dialog";
import { UsersPageClient } from "./page-client";
import { PageHeader } from "@/components/page-header";

export default async function UsersPage() {
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
        title="Usuários"
        subtitle="Gerencie os usuários, papéis e permissões do sistema"
      >
        <CreateUserDialog orgId={orgId} />
      </PageHeader>
      <UsersPageClient organizationId={orgId} />
    </>
  );
}
