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
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        id: supplierId,
        deletedAt: null,
      },
    });

    if (!existingSupplier) {
      return new NextResponse("Supplier not found", { status: 404 });
    }

    // Note: With the new Supplier model, we don't have organization associations
    // This functionality might need to be reconsidered based on your business logic
    // For now, we'll just return the supplier as is
    return NextResponse.json(existingSupplier);
  } catch (error) {
    console.error("[SUPPLIERS_ASSOCIATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
