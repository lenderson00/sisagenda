import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const associateSupplierSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
});

export async function POST(
  req: Request,
  { params }: { params: { supplierId: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const validatedBody = associateSupplierSchema.safeParse(body);

    if (!validatedBody.success) {
      return new NextResponse("Invalid body", { status: 400 });
    }

    const { supplierId } = params;
    const { organizationId } = validatedBody.data;

    // Check if the supplier exists
    const existingSupplier = await prisma.user.findFirst({
      where: {
        id: supplierId,
        role: "FORNECEDOR",
        deletedAt: null,
      },
    });

    if (!existingSupplier) {
      return new NextResponse("Supplier not found", { status: 404 });
    }

    // Check if the supplier is already associated with this organization
    const existingAssociation = await prisma.user.findFirst({
      where: {
        cnpj: existingSupplier.cnpj,
        organizationId: organizationId,
        role: "FORNECEDOR",
        deletedAt: null,
      },
    });

    if (existingAssociation) {
      return new NextResponse("Supplier is already associated with this organization", { status: 409 });
    }

    // Create a new association by creating a copy of the supplier for this organization
    const associatedSupplier = await prisma.user.create({
      data: {
        name: existingSupplier.name,
        email: existingSupplier.email,
        whatsapp: existingSupplier.whatsapp,
        cnpj: existingSupplier.cnpj,
        address: existingSupplier.address,
        organizationId: organizationId,
        role: "FORNECEDOR",
        isActive: true,
        password: existingSupplier.password, // Use the same password
        mustChangePassword: false, // Don't require password change for associated suppliers
      },
    });

    return NextResponse.json(associatedSupplier);
  } catch (error) {
    console.error("[SUPPLIERS_ASSOCIATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
