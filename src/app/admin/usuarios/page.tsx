import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  // Fetch users
  const usersRaw = await prisma.user.findMany({
    where: {
      organizationId: orgId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      whatsapp: true,
      createdAt: true,
      updatedAt: true,
      organization: {
        select: {
          id: true,
          name: true,
          sigla: true,
        },
      },
    },
  });

  // Normalize users for client
  const users = usersRaw.map((user) => ({
    ...user,
    name: user.name ?? "",
    whatsapp: user.whatsapp ?? "",
    createdAt: user.createdAt?.toISOString?.() ?? "",
    updatedAt: user.updatedAt?.toISOString?.() ?? "",
    organization: user.organization
      ? {
          id: user.organization.id ?? "",
          name: user.organization.name ?? "",
          sigla: user.organization.sigla ?? "",
        }
      : { id: "", name: "", sigla: "" },
  }));

  // Fetch stats
  const [total, active, inactive] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null, organizationId: orgId } }),
    prisma.user.count({
      where: { isActive: true, deletedAt: null, organizationId: orgId },
    }),
    prisma.user.count({
      where: { isActive: false, deletedAt: null, organizationId: orgId },
    }),
  ]);

  // Optionally, calculate suspended if needed
  const stats = { total, active, inactive };

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
      <UsersPageClient users={users} stats={stats} />
    </>
  );
}
