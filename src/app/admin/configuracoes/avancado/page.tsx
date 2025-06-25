import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdvancedTab } from "../_components/advanced-tab";
import { prisma } from "@/lib/prisma";

export default async function ConfiguracoesAvancadoPage() {
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

  const organization = await prisma.organization.findFirst({
    where: {
      id: orgId,
      deletedAt: null,
    },
  });

  if (!organization) {
    redirect("/");
  }

  return <AdvancedTab organization={organization} />;
}
