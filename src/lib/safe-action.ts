import { createSafeActionClient } from "next-safe-action";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth, signOut } from "./auth";
import { prisma } from "./prisma";

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
});

export const authAction = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    await signOut();
    redirect("/entrar");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      organization: true,
    },
  });

  if (!user) {
    redirect("/entrar");
  }

  return next({
    ctx: {
      user,
    },
  });
});

export const authSuperAdminAction = authAction.use(async ({ next, ctx }) => {

  if (ctx.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  return next();
});