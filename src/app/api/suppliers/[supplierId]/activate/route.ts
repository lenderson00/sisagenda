import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ supplierId: string }> },
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { supplierId } = await params;

    if (!supplierId) {
      return new NextResponse("Supplier ID is required", { status: 400 });
    }

    const supplier = await prisma.user.update({
      where: {
        id: supplierId,
        role: "FORNECEDOR",
      },
      data: {
        isActive: true,
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("[SUPPLIER_ACTIVATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
