import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { createUserSchema, userQuerySchema } from "./_schemas/user-schemas";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orgId = session.user.organizationId;

    const users = await prisma.user.findMany({
      where: {
        organizationId: orgId,
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

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
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
