import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateUserDialog } from "./_components/create-user-dialog";
import { UsersPageClient } from "./page-client";

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
      <div className="border-b ">
        <div className="container mx-auto px-6 py-8">
          {/* <BreadcrumbNav items={breadcrumbItems} /> */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Usuários
              </h1>
              <p className="text-gray-600">
                Gerencie os usuários, papéis e permissões do sistema
              </p>
            </div>
            <CreateUserDialog orgId={orgId} />
          </div>
        </div>
      </div>
      <UsersPageClient organizationId={orgId} />
    </>
  );
}
