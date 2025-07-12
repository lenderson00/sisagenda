import { createSafeActionClient } from "next-safe-action";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { z } from "zod";
import { defineAbilityFor } from "@/features/permissions";
import { roles } from "@/features/permissions/roles";

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
      action: z.enum(['manage', 'get', 'create', 'update', 'delete']),
      subject: z.enum(['User', 'Organization', 'Supplier']),
      role: roles,
    });
  },
});

const AuthUserSchema = z.object({
  id: z.string(),
  role: roles,
  organizationId: z.string().nullable(),
})

type AuthUser = z.infer<typeof AuthUserSchema>;

const roleBasedActionClient = actionClient.use(async ({ next, metadata }) => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized: Login required.");
  }

  const isSupplier = session.user.role === "FORNECEDOR";

  let user: AuthUser | null = null;

  if (isSupplier) {
    const supplier = await prisma.supplier.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    user = {
      id: supplier.id,
      role: "FORNECEDOR",
      organizationId: null,
    }
  } else {
    const dbUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        role: true,
        organizationId: true,
      },
    });

    if (!dbUser) {
      throw new Error("User not found.");
    }

    user = {
      id: dbUser.id,
      role: dbUser.role,
      organizationId: dbUser.organizationId,
    }
  }

  const ability = defineAbilityFor(user);

  const { action, role, subject: subjectMetadata } = metadata;

  if (role !== user.role) {
    throw new Error("Unauthorized: You don't have permission to do this action.");
  }

  const subject = {
    __typename: subjectMetadata as any,
    ...user,
  };

  if (!ability.can(action, subject)) {
    throw new Error(
      "Unauthorized: You don't have permission to do this action.",
    );
  }

  return next({
    ctx: {
      user,
    },
  });
});

export const superAdminActionClient = roleBasedActionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized: Login required.");
  }

  const isSuperAdmin = session.user.role === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    throw new Error("Unauthorized: Super admin required.");
  }
  return next();
});

export const adminActionClient = roleBasedActionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized: Login required.");
  }

  const isAdmin = session.user.role === "ADMIN";

  if (!isAdmin) {
    throw new Error("Unauthorized: Admin required.");
  }

  return next();
});

export const comimsupAdminActionClient = roleBasedActionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized: Login required.");
  }

  const isComimsupAdmin = session.user.role === "COMIMSUP_ADMIN";

  if (!isComimsupAdmin) {
    throw new Error("Unauthorized: Comimsup admin required.");
  }

  return next();
});

export const comrjAdminActionClient = roleBasedActionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized: Login required.");
  }

  const isComrjAdmin = session.user.role === "COMIMSUP_ADMIN";

  if (!isComrjAdmin) {
    throw new Error("Unauthorized: Comrj admin required.");
  }

  return next();
});

export const supplierActionClient = roleBasedActionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Unauthorized: Login required.");
  }

  const isSupplier = session.user.role === "FORNECEDOR";

  if (!isSupplier) {
    throw new Error("Unauthorized: Supplier required.");
  }



  return next();
});

export const userActionClient = roleBasedActionClient.use(async ({ next }) => {
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

