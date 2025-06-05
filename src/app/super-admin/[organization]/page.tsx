import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { OrganizationAdminClient } from "./page-client";

export default async function OrganizationAdminPage({
  params,
}: {
  params: Promise<{ organization: string }>;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    return notFound();
  }

  const nextParams = await params;

  const organization = await prisma.organization.findUnique({
    where: {
      id: nextParams.organization,
      deletedAt: null,
    },
  });

  if (!organization) {
    return notFound();
  }

  return <OrganizationAdminClient organization={organization} />;
}
