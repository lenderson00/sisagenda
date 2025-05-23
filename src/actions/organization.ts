import { prisma } from "@/lib/prisma";

export const getOrganizations = async () => {
  const organizations = await prisma.organization.findMany();
  return organizations;
};