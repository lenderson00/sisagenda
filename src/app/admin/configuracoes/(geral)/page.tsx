import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GeneralTab } from "../_components/general-tab";

export default async function ConfiguracoesPage() {
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

  return <GeneralTab organization={organization} />;
}
