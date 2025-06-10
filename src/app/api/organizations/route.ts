import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sigla: z.string().min(1, "Sigla is required"),
  description: z.string().optional(),
  role: z.enum(["COMIMSUP", "DEPOSITO", "COMRJ"]),
  isActive: z.boolean().optional().default(true),
  comimsupId: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") as "COMIMSUP" | "DEPOSITO" | "COMRJ" | undefined;

    const organizations = await prisma.organization.findMany({
      where: {
        deletedAt: null,
        role: role ?? undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(organizations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is super admin
    if (session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const validatedData = createOrganizationSchema.parse(body);

    console.log(validatedData);

    const organization = await prisma.organization.create({
      data: {
        name: validatedData.name,
        sigla: validatedData.sigla,
        description: validatedData.description,
        role: validatedData.role,
        isActive: validatedData.isActive,
        comimsupId: validatedData.role === "DEPOSITO" && validatedData.comimsupId !== "" ? validatedData.comimsupId : null,
      },
    });

    return NextResponse.json(organization);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }

    console.error("[ORGANIZATIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
