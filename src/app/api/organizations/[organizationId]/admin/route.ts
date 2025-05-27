import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const createOrganizationAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  organizationId: z.string().min(10, "required"),
});

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
    const validatedData = createOrganizationAdminSchema.parse(body);

    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      where: {
        id: validatedData.organizationId,
      },
    });

    if (!organization) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash("Marinh@2025", 10);

    // Create the admin user
    const adminUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "ADMIN",
        organizationId: validatedData.organizationId,
      },
    });

    return NextResponse.json(adminUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }

    console.error("[ORGANIZATIONS_ADMIN_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
