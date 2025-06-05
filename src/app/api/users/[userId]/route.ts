import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { updateUserSchema, userIdParamSchema } from "../_schemas/user-schemas";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const validatedParams = userIdParamSchema.safeParse(params);
    if (!validatedParams.success) {
      return new NextResponse("Invalid user ID", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: validatedParams.data.userId },
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

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const validatedParams = userIdParamSchema.safeParse(params);
    if (!validatedParams.success) {
      return new NextResponse("Invalid user ID", { status: 400 });
    }

    const body = await request.json();
    const validatedData = updateUserSchema.safeParse(body);

    if (!validatedData.success) {
      return new NextResponse(
        JSON.stringify({ errors: validatedData.error.format() }),
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { id: validatedParams.data.userId },
      data: validatedData.data,
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
    console.error("[USER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const awaitedParams = await params;

    const validatedParams = userIdParamSchema.safeParse(awaitedParams);

    if (!validatedParams.success) {
      console.log(validatedParams.error);
      return new NextResponse("Invalid user ID", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: validatedParams.data.userId },
    });

    if (!user) {
      return new NextResponse("User Not Found", { status: 404 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (
      session.user.role === "ADMIN" &&
      session.user.organizationId !== user.organizationId
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (user.isActive) {
      return new NextResponse(
        "Cannot delete active user. Please deactivate first.",
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: validatedParams.data.userId },
      data: {
        deletedAt: new Date(),
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
