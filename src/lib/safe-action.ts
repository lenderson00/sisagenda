import { createSafeActionClient } from "next-safe-action";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { z } from "zod";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    console.log("Server action error:", error);

    if (error instanceof Error) {
      return error.message;
    }

    return "An unexpected error occurred";
  },
  defineMetadataSchema() {
    return z.object({
      action: z.string(),
    });
  },
});


export const superAdminActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized: Login required.");
  }

  const isSuperAdmin = session.user.role === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    throw new Error("Unauthorized: Super admin required.");
  }

  const superAdmin = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  return next({
    ctx: {
      user: superAdmin,
    },
  });
});

export const adminActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized: Login required.");
  }

  const isAdmin = session.user.role === "ADMIN";

  if (!isAdmin) {
    throw new Error("Unauthorized: Admin required.");
  }

  const admin = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!admin) {
    throw new Error("Admin not found.");
  }

  return next({
    ctx: {
      user: admin,
    },
  });
});

export const comimsupAdminActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized: Login required.");
  }

  const isComimsupAdmin = session.user.role === "COMIMSUP_ADMIN";

  if (!isComimsupAdmin) {
    throw new Error("Unauthorized: Comimsup admin required.");
  }

  const comimsupAdmin = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!comimsupAdmin) {
    throw new Error("Comimsup admin not found.");
  }

  return next({
    ctx: {
      user: comimsupAdmin,
    },
  });
});

export const comrjAdminActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized: Login required.");
  }

  const isComrjAdmin = session.user.role === "COMIMSUP_ADMIN";

  if (!isComrjAdmin) {
    throw new Error("Unauthorized: Comrj admin required.");
  }

  const comrjAdmin = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!comrjAdmin) {
    throw new Error("Comrj admin not found.");
  }

  return next({
    ctx: {
      user: comrjAdmin,
    },
  });
});

export const supplierActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized: Login required.");
  }

  const isSupplier = session.user.role === "FORNECEDOR";

  if (!isSupplier) {
    throw new Error("Unauthorized: Supplier required.");
  }

  const supplier = await prisma.supplier.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!supplier) {
    throw new Error("Supplier not found.");
  }

  return next({
    ctx: {
      user: supplier,
    },
  });
});

export const userActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized: Login required.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      organization: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const { organization, ...userWithoutOrganization } = user;

  return next({
    ctx: {
      user: userWithoutOrganization,
      organization,
    },
  });
});

