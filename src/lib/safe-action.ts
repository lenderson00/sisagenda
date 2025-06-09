import { getUserByEmail } from "@/model/user";
import { createSafeActionClient } from "next-safe-action";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth, signOut } from "./auth";
import { getSession } from "./auth/utils";
import { prisma } from "./prisma";

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
      permissions: z.array(z.string()).optional(),
    });
  },
  handleServerError: (error) => {
    console.error("Server action error:", error);

    if (error instanceof Error) {
      return error.message;
    }

    return "An unknown error occurred.";
  },
});

export const authUserActionClient = actionClient.use(async ({ next }) => {
  const { user: sessionUser } = await getSession();

  if (!sessionUser.email) {
    throw new Error("Unauthorized: Login required.");
  }

  const user = await getUserByEmail(sessionUser.email);

  if (!user) {
    throw new Error("Unauthorized: Login required.");
  }

  return next({
    ctx: {
      user,
    },
  });
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const { user: sessionUser } = await getSession();

  if (!sessionUser.email) {
    throw new Error("Unauthorized: Login required.");
  }

  const organizationId = sessionUser.organizationId;

  if (!organizationId && sessionUser.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Organization required.");
  }

  const organization = await prisma.organization.findFirst({
    where: { id: organizationId, deletedAt: null },
    include: {
      militares: {
        where: {
          id: sessionUser.id,
        }
      }
    },
  });

  if (!organization || !organization.militares || organization.militares.length === 0) {
    throw new Error("Unauthorized: Organization required.");
  }

  return next({
    ctx: {
      user: sessionUser,
      organization,
    },
  });
});

export const authSuperAdminActionClient = authUserActionClient.use(async ({ next, ctx }) => {
  if (ctx.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Super admin required.");
  }

  return next();
});