import { prisma } from "@/lib/prisma";
import { authSuperAdminAction } from "@/lib/safe-action";

export const getOrganizations = authSuperAdminAction.metadata({
  actionName: "getOrganizations",
}).action(async () => {
  const organizations = await prisma.organization.findMany();
  return organizations;
});