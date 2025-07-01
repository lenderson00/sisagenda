import { createSafeActionClient } from "next-safe-action";
import { auth } from "./auth";
import { prisma } from "./prisma";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    console.log("Server action error:", error);

    if (error instanceof Error) {
      return error.message;
    }

    return "An unexpected error occurred";
  },
});

export const authUserActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized: Login required.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return next({
    ctx: {
      user,
    },
  });
});

export const organizationActionClient = authUserActionClient.use(
  async ({ next }) => {
    const session = await auth();

    if (!session?.user.id) {
      throw new Error("Unauthorized: Login required.");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        organization: true,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const { organization } = user;

    return next({
      ctx: {
        organization,
      },
    });
  },
);
