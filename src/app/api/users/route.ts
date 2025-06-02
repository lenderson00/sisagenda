import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createUserSchema, userQuerySchema } from "./_schemas/user-schemas";

export async function GET() {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const orgId = session.user.organizationId;


  if (!orgId) {
    return new NextResponse("Organization not found", { status: 404 });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        whatsapp: true,
        createdAt: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            sigla: true,
          },
        },
      },
    });

    // Normalize users for client
    const normalizedUsers = users.map((user) => ({
      ...user,
      name: user.name ?? "",
      whatsapp: user.whatsapp ?? "",
      createdAt: user.createdAt?.toISOString?.() ?? "",
      updatedAt: user.updatedAt?.toISOString?.() ?? "",
      organization: user.organization
        ? {
          id: user.organization.id ?? "",
          name: user.organization.name ?? "",
          sigla: user.organization.sigla ?? "",
        }
        : { id: "", name: "", sigla: "" },
    }));

    return NextResponse.json(normalizedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const organizationId = session.user.organizationId;

    const body = await request.json();
    const validatedData = createUserSchema.safeParse(body);

    if (!validatedData.success) {
      return new NextResponse(
        JSON.stringify({ errors: validatedData.error.format() }),
        { status: 400 },
      );
    }

    const { name, email, whatsapp } = validatedData.data;
    const hashedPassword = await bcrypt.hash("Marinh@2025", 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: "USER",
        password: hashedPassword,
        whatsapp,
        organizationId,
        mustChangePassword: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        whatsapp: true,
        createdAt: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            sigla: true,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
