import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  sigla: z.string().min(1, "Sigla is required").optional(),
  description: z.string().optional(),
  role: z.enum(["COMIMSUP", "DEPOSITO"]).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ organizationId: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { organizationId } = await params;

    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
        deletedAt: null,
      },
    });

    if (!organization) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error("[ORGANIZATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ organizationId: string }> },
) {
  try {
    const session = await auth();

    const { organizationId } = await params;

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is super admin
    if (session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateOrganizationSchema.parse(body);

    const organization = await prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: validatedData,
    });

    return NextResponse.json(organization);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }

    console.error("[ORGANIZATION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ organizationId: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is super admin
    if (session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { organizationId } = await params;

    // Soft delete the organization
    const organization = await prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    return NextResponse.json(organization);
  } catch (error) {
    console.error("[ORGANIZATION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
