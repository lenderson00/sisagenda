import { prisma } from "@/lib/prisma";
import { authSuperAdminAction } from "@/lib/safe-action";
import { z } from "zod";

export const getOrganizations = authSuperAdminAction.metadata({
  actionName: "getOrganizations",
}).action(async () => {
  const organizations = await prisma.organization.findMany();
  return organizations;
});

export const createOrganizationSchema = z.object({
  name: z.string(),
  sigla: z.string(),
  description: z.string().optional(),
  role: z.enum(["CSUP", "COMRJ", "DEPOSITO"]),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export const createOrganization = authSuperAdminAction.metadata({
  actionName: "createOrganization",
}).schema(createOrganizationSchema).action(async ({ parsedInput }) => {

  const { name, sigla, description, role } = parsedInput;

  const organization = await prisma.organization.create({
    data: {
      name,
      sigla,
      description,
      role,
    },
  });


  return organization;
});