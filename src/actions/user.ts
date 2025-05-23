import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/safe-action";
import { z } from "zod";

export const getUserByEmail = authAction.metadata({
  actionName: "getUserByEmail",
}).schema(z.object({
  email: z.string(),
})).action(async ({ ctx: { user }, parsedInput: { email } }) => {

  if (!user || user.role !== "SUPER_ADMIN") {
    throw new Error("Usuário não autenticado ou não tem permissão para acessar esta página");
  }

  const userResult = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!userResult) {
    throw new Error("Usuário não encontrado");
  }

  return userResult;
});